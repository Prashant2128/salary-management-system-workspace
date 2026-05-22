import { z } from "zod";
import { DEPARTMENTS, EMPLOYEE_SORT_FIELDS, EMPLOYMENT_TYPES } from "../constants/employee";

const salarySchema = z
  .number()
  .finite()
  .positive("Salary must be greater than zero")
  .max(1_000_000_000, "Salary is too large");

const countrySchema = z.string().regex(/^[A-Z]{2}$/, "Country must be ISO alpha-2");
const currencySchema = z.string().regex(/^[A-Z]{3}$/, "Currency must be ISO 4217");

const startDateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Start date must be a valid ISO date")
  .refine((value) => new Date(value).getTime() <= Date.now(), "Start date cannot be in future");

const booleanQuery = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((value) => value === true || value === "true");

export const createEmployeeSchema = z.object({
  employeeNumber: z
    .string()
    .regex(/^EMP-\d{5}$/, "Employee number must match EMP-00000 pattern"),
  fullName: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(160),
  jobTitle: z.string().trim().min(2).max(120),
  department: z.enum(DEPARTMENTS),
  country: countrySchema,
  currency: currencySchema,
  salary: salarySchema,
  employmentType: z.enum(EMPLOYMENT_TYPES),
  startDate: startDateSchema,
  isActive: z.boolean().optional()
});

export const updateEmployeeSchema = createEmployeeSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required for update"
);

export const employeeIdParamSchema = z.object({
  id: z.string().uuid("Employee id must be a valid UUID")
});

export const employeeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  search: z.string().trim().optional(),
  country: countrySchema.optional(),
  jobTitle: z.string().trim().min(1).optional(),
  department: z.enum(DEPARTMENTS).optional(),
  isActive: booleanQuery.optional(),
  includeInactive: booleanQuery.optional(),
  sortBy: z.enum(EMPLOYEE_SORT_FIELDS).default("fullName"),
  sortOrder: z.enum(["asc", "desc"]).default("asc")
});

export const countryAndTitleQuerySchema = z.object({
  country: countrySchema,
  jobTitle: z.string().trim().min(1)
});

export const jobTitlesQuerySchema = z.object({
  country: countrySchema.optional()
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
export type EmployeeListQueryDto = z.infer<typeof employeeListQuerySchema>;
