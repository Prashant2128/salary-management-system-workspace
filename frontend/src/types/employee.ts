import { Department, EmploymentType } from "../constants/options";

export type { Department, EmploymentType };

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

export type CreateEmployeePayload = Omit<Employee, "id" | "isActive" | "createdAt" | "updatedAt"> & {
  isActive?: boolean;
};

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

export interface EmployeeListResponse {
  data: Employee[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CountryInsight {
  country: string;
  count: number;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  medianSalary: number;
  totalPayroll: number;
}

export interface CountryTitleInsight {
  country: string;
  jobTitle: string;
  count: number;
  avgSalary: number | null;
  minSalary: number | null;
  maxSalary: number | null;
}

export interface SummaryInsight {
  totalEmployees: number;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  topCountriesByAverageSalary: Array<{ country: string; avgSalary: number; count: number }>;
  topDepartmentsByEmployeeCount: Array<{ department: string; count: number }>;
}
