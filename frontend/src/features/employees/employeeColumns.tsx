import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Employee } from "../../types/employee";
import { formatCurrency } from "../../utils/formatters";

interface EmployeeColumnHandlers {
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const buildEmployeeColumns = ({
  onEdit,
  onDelete
}: EmployeeColumnHandlers): GridColDef<Employee>[] => [
  { field: "employeeNumber", headerName: "Employee #", flex: 0.8, minWidth: 120 },
  { field: "fullName", headerName: "Full Name", flex: 1, minWidth: 180 },
  { field: "email", headerName: "Email", flex: 1.3, minWidth: 220 },
  { field: "jobTitle", headerName: "Job Title", flex: 1, minWidth: 180 },
  { field: "department", headerName: "Department", flex: 0.9, minWidth: 140 },
  { field: "country", headerName: "Country", flex: 0.5, minWidth: 90 },
  {
    field: "salary",
    headerName: "Salary",
    flex: 0.8,
    minWidth: 130,
    valueFormatter: (value, row) => formatCurrency(Number(value), row.currency)
  },
  {
    field: "actions",
    headerName: "Actions",
    minWidth: 110,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => onEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deactivate">
          <IconButton size="small" color="error" onClick={() => onDelete(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    )
  }
];
