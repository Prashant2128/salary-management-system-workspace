import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { departments, employmentTypes } from "../constants/options";
import { Employee } from "../types/employee";
import { EmployeeFormValues, employeeFormSchema } from "../validation/employeeSchema";

const textFields: Array<{
  name: keyof EmployeeFormValues;
  label: string;
  type?: "text" | "number" | "date";
}> = [
  { name: "employeeNumber", label: "Employee Number" },
  { name: "fullName", label: "Full Name" },
  { name: "email", label: "Email" },
  { name: "jobTitle", label: "Job Title" },
  { name: "country", label: "Country" },
  { name: "currency", label: "Currency" },
  { name: "salary", label: "Salary", type: "number" },
  { name: "startDate", label: "Start Date", type: "date" }
];

interface EmployeeDialogProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSubmit: (payload: EmployeeFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const defaultValues: EmployeeFormValues = {
  employeeNumber: "EMP-00001",
  fullName: "",
  email: "",
  jobTitle: "",
  department: departments[0],
  country: "US",
  currency: "USD",
  salary: "50000",
  employmentType: employmentTypes[0],
  startDate: "2024-01-01"
};

export const EmployeeDialog = ({
  open,
  employee,
  onClose,
  onSubmit,
  isSubmitting
}: EmployeeDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (employee) {
      reset({
        employeeNumber: employee.employeeNumber,
        fullName: employee.fullName,
        email: employee.email,
        jobTitle: employee.jobTitle,
        department: employee.department,
        country: employee.country,
        currency: employee.currency,
        salary: employee.salary.toString(),
        employmentType: employee.employmentType,
        startDate: employee.startDate.slice(0, 10)
      });
      return;
    }
    reset(defaultValues);
  }, [employee, reset, open]);

  const title = employee ? "Edit Employee" : "Add Employee";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {textFields.map((field) => (
            <Grid item xs={12} md={6} key={field.name}>
              <Controller
                name={field.name}
                control={control}
                render={({ field: controlledField }) => (
                  <TextField
                    {...controlledField}
                    label={field.label}
                    type={field.type ?? "text"}
                    fullWidth
                    InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name]?.message}
                  />
                )}
              />
            </Grid>
          ))}

          <Grid item xs={12} md={6}>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Department"
                  fullWidth
                  {...field}
                  error={Boolean(errors.department)}
                  helperText={errors.department?.message}
                >
                  {departments.map((department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Employment Type"
                  fullWidth
                  {...field}
                  error={Boolean(errors.employmentType)}
                  helperText={errors.employmentType?.message}
                >
                  {employmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
          disabled={isSubmitting}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
