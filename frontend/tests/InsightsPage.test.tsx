import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InsightsPage } from "../src/pages/InsightsPage";

const mockInsightsApi = vi.hoisted(() => ({
  byCountry: vi.fn(),
  summary: vi.fn(),
  countries: vi.fn(),
  jobTitles: vi.fn(),
  byCountryAndTitle: vi.fn()
}));

vi.mock("../src/api/insightsApi", () => ({
  insightsApi: mockInsightsApi
}));

describe("InsightsPage", () => {
  it("renders summary cards from API", async () => {
    mockInsightsApi.byCountry.mockResolvedValue([]);
    mockInsightsApi.summary.mockResolvedValue({
      totalEmployees: 10000,
      avgSalary: 100000,
      minSalary: 50000,
      maxSalary: 180000,
      topCountriesByAverageSalary: [],
      topDepartmentsByEmployeeCount: [{ department: "Engineering", count: 5000 }]
    });
    mockInsightsApi.countries.mockResolvedValue(["US"]);
    mockInsightsApi.jobTitles.mockResolvedValue(["Software Engineer"]);

    render(<InsightsPage />);

    await waitFor(() => expect(screen.getByText("Total Active Employees")).toBeInTheDocument());
    expect(screen.getByText("10,000")).toBeInTheDocument();
  });
});
