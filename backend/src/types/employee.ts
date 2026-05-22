import { Department, EmployeeSortField, EmploymentType } from "../constants/employee";

export type { Department, EmploymentType, EmployeeSortField };

export interface Employee {
  id: string;
  employeeNumber: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: Department;
  country: string;
  currency: string;
  salary: number;
  employmentType: EmploymentType;
  startDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeInput {
  employeeNumber: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: Department;
  country: string;
  currency: string;
  salary: number;
  employmentType: EmploymentType;
  startDate: string;
  isActive?: boolean;
}

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export interface EmployeeListQuery {
  page: number;
  pageSize: number;
  search?: string;
  country?: string;
  jobTitle?: string;
  department?: Department;
  isActive?: boolean;
  includeInactive?: boolean;
  sortBy: EmployeeSortField;
  sortOrder: "asc" | "desc";
}

export interface PaginatedEmployees {
  data: Employee[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
