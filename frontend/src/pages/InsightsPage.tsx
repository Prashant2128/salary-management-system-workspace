import {
  Card,
  CardContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { insightsApi } from "../api/insightsApi";
import { ErrorAlert } from "../components/ErrorAlert";
import { FilterSelect } from "../components/FilterSelect";
import { useCountryJobTitleFilters } from "../hooks/useCountryJobTitleFilters";
import { CountryInsight, CountryTitleInsight, SummaryInsight } from "../types/employee";
import { formatCurrency, formatNullableCurrency } from "../utils/formatters";

export const InsightsPage = () => {
  const [countryData, setCountryData] = useState<CountryInsight[]>([]);
  const [summary, setSummary] = useState<SummaryInsight | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [titleInsight, setTitleInsight] = useState<CountryTitleInsight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { countries, jobTitles, error: filterError } = useCountryJobTitleFilters(selectedCountry);

  useEffect(() => {
    const loadBase = async () => {
      try {
        setError(null);
        const [countryMetrics, summaryMetrics] = await Promise.all([
          insightsApi.byCountry(),
          insightsApi.summary()
        ]);
        setCountryData(countryMetrics);
        setSummary(summaryMetrics);
      } catch (requestError) {
        setError((requestError as Error).message);
      }
    };
    void loadBase();
  }, []);

  useEffect(() => {
    setSelectedJobTitle("");
    setTitleInsight(null);
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedJobTitle) {
      setTitleInsight(null);
      return;
    }

    const loadTitleInsight = async () => {
      try {
        setError(null);
        const data = await insightsApi.byCountryAndTitle(selectedCountry, selectedJobTitle);
        setTitleInsight(data);
      } catch (requestError) {
        setError((requestError as Error).message);
      }
    };
    void loadTitleInsight();
  }, [selectedCountry, selectedJobTitle]);

  const summaryCards = useMemo(
    () =>
      summary
        ? [
            { label: "Total Active Employees", value: summary.totalEmployees.toLocaleString() },
            { label: "Average Salary", value: formatCurrency(summary.avgSalary) },
            { label: "Minimum Salary", value: formatCurrency(summary.minSalary) },
            { label: "Maximum Salary", value: formatCurrency(summary.maxSalary) }
          ]
        : [],
    [summary]
  );

  const displayError = error ?? filterError;

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Salary Insights</Typography>
      <ErrorAlert message={displayError} onClose={() => setError(null)} />

      <Grid container spacing={2}>
        {summaryCards.map((card) => (
          <Grid item xs={12} md={3} key={card.label}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  {card.label}
                </Typography>
                <Typography variant="h6">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {summary && summary.topDepartmentsByEmployeeCount.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Departments by Headcount
            </Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
              {summary.topDepartmentsByEmployeeCount.slice(0, 5).map((item) => (
                <Typography key={item.department}>
                  {item.department}: {item.count.toLocaleString()}
                </Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Country and Job Title Insight
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
            <FilterSelect
              label="Country"
              value={selectedCountry}
              options={countries}
              onChange={setSelectedCountry}
              includeAll={false}
              allLabel="Select country"
            />
            <FilterSelect
              label="Job Title"
              value={selectedJobTitle}
              options={jobTitles}
              onChange={setSelectedJobTitle}
              includeAll={false}
              allLabel="Select job title"
            />
          </Stack>
          {titleInsight && (
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
              <Typography>Count: {titleInsight.count}</Typography>
              <Typography>
                Average: {formatNullableCurrency(titleInsight.avgSalary)}
              </Typography>
              <Typography>
                Minimum: {formatNullableCurrency(titleInsight.minSalary)}
              </Typography>
              <Typography>
                Maximum: {formatNullableCurrency(titleInsight.maxSalary)}
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Country Salary Distribution
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Country</TableCell>
                <TableCell>Employees</TableCell>
                <TableCell>Minimum</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Median</TableCell>
                <TableCell>Maximum</TableCell>
                <TableCell>Total Payroll</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {countryData.map((row) => (
                <TableRow key={row.country}>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>{formatCurrency(row.minSalary)}</TableCell>
                  <TableCell>{formatCurrency(row.avgSalary)}</TableCell>
                  <TableCell>{formatCurrency(row.medianSalary)}</TableCell>
                  <TableCell>{formatCurrency(row.maxSalary)}</TableCell>
                  <TableCell>{formatCurrency(row.totalPayroll)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
};
