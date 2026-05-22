"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpdateRow = exports.toInsertRow = exports.mapEmployeeRow = void 0;
const API_TO_DB = {
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
const mapEmployeeRow = (row) => ({
    id: String(row.id),
    employeeNumber: String(row.employee_number),
    fullName: String(row.full_name),
    email: String(row.email),
    jobTitle: String(row.job_title),
    department: String(row.department),
    country: String(row.country),
    currency: String(row.currency),
    salary: Number(row.salary),
    employmentType: row.employment_type,
    startDate: String(row.start_date),
    isActive: Boolean(row.is_active),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
});
exports.mapEmployeeRow = mapEmployeeRow;
const toInsertRow = (payload) => ({
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
exports.toInsertRow = toInsertRow;
const toUpdateRow = (payload) => {
    const updateData = {};
    for (const [apiKey, dbKey] of Object.entries(API_TO_DB)) {
        const value = payload[apiKey];
        if (value !== undefined) {
            updateData[dbKey] = value;
        }
    }
    return updateData;
};
exports.toUpdateRow = toUpdateRow;
