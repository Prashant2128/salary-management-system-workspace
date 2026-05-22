import { Stack, TextField } from "@mui/material";
import { FilterSelect } from "../../components/FilterSelect";
import { departments } from "../../constants/options";

interface EmployeeFiltersProps {
  searchInput: string;
  country: string;
  department: string;
  jobTitle: string;
  countries: string[];
  jobTitles: string[];
  onSearchChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
}

export const EmployeeFilters = ({
  searchInput,
  country,
  department,
  jobTitle,
  countries,
  jobTitles,
  onSearchChange,
  onCountryChange,
  onDepartmentChange,
  onJobTitleChange
}: EmployeeFiltersProps) => (
  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
    <TextField
      label="Search by name or email"
      value={searchInput}
      onChange={(event) => onSearchChange(event.target.value)}
      fullWidth
    />
    <FilterSelect label="Country" value={country} options={countries} onChange={onCountryChange} />
    <FilterSelect
      label="Department"
      value={department}
      options={[...departments]}
      onChange={onDepartmentChange}
    />
    <FilterSelect label="Job Title" value={jobTitle} options={jobTitles} onChange={onJobTitleChange} />
  </Stack>
);
