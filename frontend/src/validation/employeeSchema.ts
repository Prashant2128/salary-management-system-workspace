import { z } from "zod";
import { departments, employmentTypes } from "../constants/options";

const countrySchema = z.string().regex(/^[A-Z]{2}$/, "Country must be ISO alpha-2");
const currencySchema = z.string().regex(/^[A-Z]{3}$/, "Currency must be ISO 4217");

const startDateSchema = z
  .string()
  .min(1, "Start date is required")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Start date must be valid")
  .refine((value) => new Date(value).getTime() <= Date.now(), "Start date cannot be in the future");

export const employeeFormSchema = z.object({
  employeeNumber: z
    .string()
    .regex(/^EMP-\d{5}$/, "Employee number must match EMP-00000 pattern"),
  fullName: z.string().trim().min(3, "Full name is required").max(120),
  email: z.string().trim().email("Invalid email").max(160),
  jobTitle: z.string().trim().min(2, "Job title is required").max(120),
  department: z.enum(departments),
  country: countrySchema,
  currency: currencySchema,
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, "Salary must be positive")
    .refine((value) => Number(value) <= 1_000_000_000, "Salary is too large"),
  employmentType: z.enum(employmentTypes),
  startDate: startDateSchema
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
