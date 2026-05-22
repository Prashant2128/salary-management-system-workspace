"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobTitlesQuerySchema = exports.countryAndTitleQuerySchema = exports.employeeListQuerySchema = exports.employeeIdParamSchema = exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const zod_1 = require("zod");
const employee_1 = require("../constants/employee");
const salarySchema = zod_1.z
    .number()
    .finite()
    .positive("Salary must be greater than zero")
    .max(1000000000, "Salary is too large");
const countrySchema = zod_1.z.string().regex(/^[A-Z]{2}$/, "Country must be ISO alpha-2");
const currencySchema = zod_1.z.string().regex(/^[A-Z]{3}$/, "Currency must be ISO 4217");
const startDateSchema = zod_1.z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Start date must be a valid ISO date")
    .refine((value) => new Date(value).getTime() <= Date.now(), "Start date cannot be in future");
const booleanQuery = zod_1.z
    .union([zod_1.z.literal("true"), zod_1.z.literal("false"), zod_1.z.boolean()])
    .transform((value) => value === true || value === "true");
exports.createEmployeeSchema = zod_1.z.object({
    employeeNumber: zod_1.z
        .string()
        .regex(/^EMP-\d{5}$/, "Employee number must match EMP-00000 pattern"),
    fullName: zod_1.z.string().trim().min(3).max(120),
    email: zod_1.z.string().trim().email().max(160),
    jobTitle: zod_1.z.string().trim().min(2).max(120),
    department: zod_1.z.enum(employee_1.DEPARTMENTS),
    country: countrySchema,
    currency: currencySchema,
    salary: salarySchema,
    employmentType: zod_1.z.enum(employee_1.EMPLOYMENT_TYPES),
    startDate: startDateSchema,
    isActive: zod_1.z.boolean().optional()
});
exports.updateEmployeeSchema = exports.createEmployeeSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field is required for update");
exports.employeeIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Employee id must be a valid UUID")
});
exports.employeeListQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(25),
    search: zod_1.z.string().trim().optional(),
    country: countrySchema.optional(),
    jobTitle: zod_1.z.string().trim().min(1).optional(),
    department: zod_1.z.enum(employee_1.DEPARTMENTS).optional(),
    isActive: booleanQuery.optional(),
    includeInactive: booleanQuery.optional(),
    sortBy: zod_1.z.enum(employee_1.EMPLOYEE_SORT_FIELDS).default("fullName"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc")
});
exports.countryAndTitleQuerySchema = zod_1.z.object({
    country: countrySchema,
    jobTitle: zod_1.z.string().trim().min(1)
});
exports.jobTitlesQuerySchema = zod_1.z.object({
    country: countrySchema.optional()
});
