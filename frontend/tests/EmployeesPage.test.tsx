import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmployeesPage } from "../src/pages/EmployeesPage";

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows }: { rows: Array<{ fullName: string }> }) => (
    <div>
      <div>Mock DataGrid</div>
      {rows.map((row) => (
        <div key={row.fullName}>{row.fullName}</div>
      ))}
    </div>
  )
}));

const mockEmployeesApi = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn()
}));

const mockInsightsApi = vi.hoisted(() => ({
  countries: vi.fn(),
  jobTitles: vi.fn()
}));

vi.mock("../src/api/employeesApi", () => ({
  employeesApi: mockEmployeesApi
}));

vi.mock("../src/api/insightsApi", () => ({
  insightsApi: mockInsightsApi
}));

describe("EmployeesPage", () => {
  beforeEach(() => {
    mockEmployeesApi.list.mockResolvedValue({
      data: [
        {
          id: "1",
          employeeNumber: "EMP-00001",
          fullName: "Alice Walker",
          email: "alice@company.test",
          jobTitle: "Software Engineer",
          department: "Engineering",
          country: "US",
          currency: "USD",
          salary: 100000,
          employmentType: "FULL_TIME",
          startDate: "2024-01-01",
          isActive: true,
          createdAt: "",
          updatedAt: ""
        }
      ],
      meta: {
        page: 1,
        pageSize: 25,
        total: 1,
        totalPages: 1
      }
    });
    mockInsightsApi.countries.mockResolvedValue(["US"]);
    mockInsightsApi.jobTitles.mockResolvedValue(["Software Engineer"]);
  });

  it("renders rows from API", async () => {
    render(
      <MemoryRouter>
        <EmployeesPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Alice Walker")).toBeInTheDocument());
    expect(mockEmployeesApi.list).toHaveBeenCalled();
  });
});
