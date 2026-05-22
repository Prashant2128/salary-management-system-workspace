export const DEPARTMENTS = [
  "Engineering",
  "HR",
  "Sales",
  "Finance",
  "Operations",
  "Marketing",
  "Legal",
  "Support"
] as const;

export const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT"] as const;

export const EMPLOYEE_SORT_FIELDS = [
  "fullName",
  "country",
  "jobTitle",
  "department",
  "salary",
  "startDate"
] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type EmployeeSortField = (typeof EMPLOYEE_SORT_FIELDS)[number];
