"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeService = void 0;
const knex_1 = require("../db/knex");
const appError_1 = require("../errors/appError");
const employeeMapper_1 = require("../mappers/employeeMapper");
const mapDatabaseError_1 = require("../utils/mapDatabaseError");
const SORT_COLUMN_MAP = {
    fullName: "full_name",
    country: "country",
    jobTitle: "job_title",
    department: "department",
    salary: "salary",
    startDate: "start_date"
};
const applyActiveFilter = (query, filters) => {
    if (typeof filters.isActive === "boolean") {
        query.where("is_active", filters.isActive);
        return;
    }
    if (!filters.includeInactive) {
        query.where("is_active", true);
    }
};
const withDatabaseError = async (operation) => {
    try {
        return await operation();
    }
    catch (error) {
        const mapped = (0, mapDatabaseError_1.mapDatabaseError)(error);
        if (mapped) {
            throw mapped;
        }
        throw error;
    }
};
exports.employeeService = {
    async listEmployees(filters) {
        const page = filters.page;
        const pageSize = filters.pageSize;
        const offset = (page - 1) * pageSize;
        const baseQuery = (0, knex_1.db)("employees");
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
            .count("id as count");
        const total = Number(count ?? 0);
        const rows = await baseQuery
            .clone()
            .select("*")
            .orderBy(SORT_COLUMN_MAP[filters.sortBy], filters.sortOrder)
            .limit(pageSize)
            .offset(offset);
        return {
            data: rows.map((row) => (0, employeeMapper_1.mapEmployeeRow)(row)),
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.max(1, Math.ceil(total / pageSize))
            }
        };
    },
    async getById(id) {
        const row = await (0, knex_1.db)("employees").where({ id }).first();
        if (!row) {
            throw new appError_1.AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND");
        }
        return (0, employeeMapper_1.mapEmployeeRow)(row);
    },
    async createEmployee(payload) {
        return withDatabaseError(async () => {
            const [row] = await (0, knex_1.db)("employees").insert((0, employeeMapper_1.toInsertRow)(payload)).returning("*");
            return (0, employeeMapper_1.mapEmployeeRow)(row);
        });
    },
    async updateEmployee(id, payload) {
        return withDatabaseError(async () => {
            const updateData = (0, employeeMapper_1.toUpdateRow)(payload);
            updateData.updated_at = knex_1.db.fn.now();
            const [row] = await (0, knex_1.db)("employees").where({ id }).update(updateData).returning("*");
            if (!row) {
                throw new appError_1.AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND");
            }
            return (0, employeeMapper_1.mapEmployeeRow)(row);
        });
    },
    async softDeleteEmployee(id) {
        const [row] = await (0, knex_1.db)("employees")
            .where({ id })
            .update({
            is_active: false,
            updated_at: knex_1.db.fn.now()
        })
            .returning("*");
        if (!row) {
            throw new appError_1.AppError("Employee not found", 404, "EMPLOYEE_NOT_FOUND");
        }
        return (0, employeeMapper_1.mapEmployeeRow)(row);
    }
};
