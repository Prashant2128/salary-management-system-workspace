import { Department } from "../constants/employee";
import { CreateEmployeeInput, Employee, UpdateEmployeeInput } from "../types/employee";

const API_TO_DB: Record<keyof CreateEmployeeInput, string> = {
  employeeNumber: "employee_number",
  fullName: "full_name",
  email: "email",
  jobTitle: "job_title",
  department: "department",
  country: "country",
  currency: "currency",
  salary: "salary",
  employmentType: "employment_type",
  startDate: "start_date",
  isActive: "is_active"
};

export const mapEmployeeRow = (row: Record<string, unknown>): Employee => ({
  id: String(row.id),
  employeeNumber: String(row.employee_number),
  fullName: String(row.full_name),
  email: String(row.email),
  jobTitle: String(row.job_title),
  department: String(row.department) as Department,
  country: String(row.country),
  currency: String(row.currency),
  salary: Number(row.salary),
  employmentType: row.employment_type as Employee["employmentType"],
  startDate: String(row.start_date),
  isActive: Boolean(row.is_active),
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at)
});

export const toInsertRow = (payload: CreateEmployeeInput) => ({
  employee_number: payload.employeeNumber,
  full_name: payload.fullName,
  email: payload.email,
  job_title: payload.jobTitle,
  department: payload.department,
  country: payload.country,
  currency: payload.currency,
  salary: payload.salary,
  employment_type: payload.employmentType,
  start_date: payload.startDate,
  is_active: payload.isActive ?? true
});

export const toUpdateRow = (payload: UpdateEmployeeInput): Record<string, unknown> => {
  const updateData: Record<string, unknown> = {};

  for (const [apiKey, dbKey] of Object.entries(API_TO_DB)) {
    const value = payload[apiKey as keyof UpdateEmployeeInput];
    if (value !== undefined) {
      updateData[dbKey] = value;
    }
  }

  return updateData;
};
