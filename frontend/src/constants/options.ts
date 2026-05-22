export const departments = [
  "Engineering",
  "HR",
  "Sales",
  "Finance",
  "Operations",
  "Marketing",
  "Legal",
  "Support"
] as const;

export const employmentTypes = ["FULL_TIME", "PART_TIME", "CONTRACT"] as const;

export type Department = (typeof departments)[number];
export type EmploymentType = (typeof employmentTypes)[number];
