import { Add as AddIcon } from "@mui/icons-material";
import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmployeeDialog } from "../components/EmployeeDialog";
import { ErrorAlert } from "../components/ErrorAlert";
import { buildEmployeeColumns } from "../features/employees/employeeColumns";
import { EmployeeFilters } from "../features/employees/EmployeeFilters";
import { useEmployees } from "../hooks/useEmployees";
import { Employee } from "../types/employee";
import { EmployeeFormValues } from "../validation/employeeSchema";

export const EmployeesPage = () => {
  const {
    rows,
    loading,
    page,
    pageSize,
    totalRows,
    sortModel,
    searchInput,
    country,
    department,
    jobTitle,
    countries,
    jobTitles,
    error,
    successMessage,
    setPage,
    setPageSize,
    setSortModel,
    setSearchInput,
    setCountry,
    setDepartment,
    setJobTitle,
    setError,
    setSuccessMessage,
    saveEmployee,
    deactivateEmployee
  } = useEmployees();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const columns = useMemo(
    () =>
      buildEmployeeColumns({
        onEdit: (employee) => {
          setSelectedEmployee(employee);
          setDialogOpen(true);
        },
        onDelete: (employee) => setDeleteTarget(employee)
      }),
    []
  );

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        gap={2}
      >
        <Typography variant="h5">Employees</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedEmployee(null);
            setDialogOpen(true);
          }}
        >
          Add Employee
        </Button>
      </Stack>

      <EmployeeFilters
        searchInput={searchInput}
        country={country}
        department={department}
        jobTitle={jobTitle}
        countries={countries}
        jobTitles={jobTitles}
        onSearchChange={setSearchInput}
        onCountryChange={setCountry}
        onDepartmentChange={setDepartment}
        onJobTitleChange={setJobTitle}
      />

      <ErrorAlert message={error} onClose={() => setError(null)} />

      <Box sx={{ height: { xs: 480, md: 650 }, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          rowCount={totalRows}
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          disableRowSelectionOnClick
        />
      </Box>

      <EmployeeDialog
        open={dialogOpen}
        employee={selectedEmployee}
        isSubmitting={saving}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (payload: EmployeeFormValues) => {
          setSaving(true);
          try {
            await saveEmployee(selectedEmployee, payload);
            setDialogOpen(false);
          } catch (saveError) {
            setError((saveError as Error).message);
          } finally {
            setSaving(false);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Deactivate employee?"
        message={`This will mark ${deleteTarget?.fullName ?? "this employee"} as inactive.`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) {
            return;
          }
          setDeleting(true);
          try {
            await deactivateEmployee(deleteTarget);
            setDeleteTarget(null);
          } catch (deleteError) {
            setError((deleteError as Error).message);
          } finally {
            setDeleting(false);
          }
        }}
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
