import { EmployeeSortField } from "../constants/employee";
import { db } from "../db/knex";
import { AppError } from "../errors/appError";
import { mapEmployeeRow, toInsertRow, toUpdateRow } from "../mappers/employeeMapper";
import {
  CreateEmployeeInput,
  EmployeeListQuery,
  PaginatedEmployees,
  UpdateEmployeeInput
} from "../types/employee";
import { mapDatabaseError } from "../utils/mapDatabaseError";

const SORT_COLUMN_MAP: Record<EmployeeSortField, string> = {
  fullName: "full_name",
  country: "country",
  jobTitle: "job_title",
  department: "department",
  salary: "salary",
  startDate: "start_date"
};

const applyActiveFilter = (query: ReturnType<typeof db>, filters: EmployeeListQuery) => {
  if (typeof filters.isActive === "boolean") {
    query.where("is_active", filters.isActive);
    return;
  }

  if (!filters.includeInactive) {
    query.where("is_active", true);
  }
};

const withDatabaseError = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const mapped = mapDatabaseError(error);
    if (mapped) {
      throw mapped;
    }
    throw error;
  }
};

export const employeeService = {
  async listEmployees(filters: EmployeeListQuery): Promise<PaginatedEmployees> {
    const page = filters.page;
    const pageSize = filters.pageSize;
    const offset = (page - 1) * pageSize;

    const baseQuery = db("employees");
    applyActiveFilter(baseQuery, filters);

    if (filters.search) {
      baseQuery.andWhere((builder) => {
        builder
          .whereILike("full_name", `%${filters.search}%`)
          .orWhereILike("email", `%${filters.search}%`);
      });
    }
    if (filters.country) {
      baseQuery.where("country", filters.country);
    }
    if (filters.jobTitle) {
      baseQuery.where("job_title", filters.jobTitle);
    }
    if (filters.department) {
      baseQuery.where("department", filters.department);
    }

    const [{ count }] = await baseQuery
      .clone()
      .clearSelect()
      .clearOrder()
      .count<{ count: string }[]>("id as count");
    const total = Number(count ?? 0);

    const rows = await baseQuery
      .clone()
      .select("*")
      .orderBy(SORT_COLUMN_MAP[filters.sortBy], filters.sortOrder)
      .limit(pageSize)
      .offset(offset);

    return {
      data: rows.map((row) => mapEmployeeRow(row)),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize))
      }
    };
  },

  async getById(id: string) {
    const row = await db("employees").where({ id }).first();
    if (!row) {
      throw new AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND");
    }
    return mapEmployeeRow(row);
  },

  async createEmployee(payload: CreateEmployeeInput) {
    return withDatabaseError(async () => {
      const [row] = await db("employees").insert(toInsertRow(payload)).returning("*");
      return mapEmployeeRow(row);
    });
  },

  async updateEmployee(id: string, payload: UpdateEmployeeInput) {
    return withDatabaseError(async () => {
      const updateData = toUpdateRow(payload);
      updateData.updated_at = db.fn.now();

      const [row] = await db("employees").where({ id }).update(updateData).returning("*");
      if (!row) {
        throw new AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND");
      }
      return mapEmployeeRow(row);
    });
  },

  async softDeleteEmployee(id: string) {
    const [row] = await db("employees")
      .where({ id })
      .update({
        is_active: false,
        updated_at: db.fn.now()
      })
      .returning("*");

    if (!row) {
      throw new AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND");
    }
    return mapEmployeeRow(row);
  }
};
