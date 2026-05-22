import { GridSortModel } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { employeesApi } from "../api/employeesApi";
import { insightsApi } from "../api/insightsApi";
import { Employee } from "../types/employee";
import { EmployeeFormValues } from "../validation/employeeSchema";

const SORT_FIELD_MAP: Record<string, string> = {
  fullName: "fullName",
  country: "country",
  jobTitle: "jobTitle",
  salary: "salary",
  department: "department",
  startDate: "startDate"
};

export const useEmployees = () => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRows, setTotalRows] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "fullName", sort: "asc" }]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sort = sortModel[0];
      const response = await employeesApi.list({
        page: page + 1,
        pageSize,
        search: debouncedSearch || undefined,
        country: country || undefined,
        department: department || undefined,
        jobTitle: jobTitle || undefined,
        sortBy: sort ? SORT_FIELD_MAP[sort.field] : "fullName",
        sortOrder: sort?.sort ?? "asc"
      });
      setRows(response.data);
      setTotalRows(response.meta.total);
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setLoading(false);
    }
  }, [country, debouncedSearch, department, jobTitle, page, pageSize, sortModel]);

  useEffect(() => {
    void fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [countryItems, titleItems] = await Promise.all([
          insightsApi.countries(),
          insightsApi.jobTitles()
        ]);
        setCountries(countryItems);
        setJobTitles(titleItems);
      } catch (requestError) {
        setError((requestError as Error).message);
      }
    };
    void loadFilters();
  }, []);

  useEffect(() => {
    const loadCountryTitles = async () => {
      try {
        const titles = await insightsApi.jobTitles(country || undefined);
        setJobTitles(titles);
        if (country) {
          setJobTitle("");
        }
      } catch (requestError) {
        setError((requestError as Error).message);
      }
    };
    void loadCountryTitles();
  }, [country]);

  const saveEmployee = async (selected: Employee | null, payload: EmployeeFormValues) => {
    const employeePayload = {
      ...payload,
      salary: Number(payload.salary),
      department: payload.department,
      employmentType: payload.employmentType
    };

    if (selected) {
      await employeesApi.update(selected.id, employeePayload);
      setSuccessMessage("Employee updated successfully");
    } else {
      await employeesApi.create(employeePayload);
      setSuccessMessage("Employee created successfully");
    }
    await fetchEmployees();
  };

  const deactivateEmployee = async (employee: Employee) => {
    await employeesApi.remove(employee.id);
    setSuccessMessage("Employee deactivated");
    await fetchEmployees();
  };

  return {
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
  };
};
