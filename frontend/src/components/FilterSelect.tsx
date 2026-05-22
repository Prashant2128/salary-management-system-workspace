import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  includeAll?: boolean;
  allLabel?: string;
}

export const FilterSelect = ({
  label,
  value,
  options,
  onChange,
  includeAll = true,
  allLabel = "All"
}: FilterSelectProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={handleChange} displayEmpty={!includeAll}>
        {includeAll ? (
          <MenuItem value="">{allLabel}</MenuItem>
        ) : (
          <MenuItem value="" disabled>
            {allLabel}
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
