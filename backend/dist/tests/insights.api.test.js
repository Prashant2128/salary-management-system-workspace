"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
const testDb_1 = require("./testDb");
const fixtureRows = [
    {
        employee_number: "EMP-10001",
        full_name: "Alice Walker",
        email: "alice.walker@company.test",
        job_title: "Software Engineer",
        department: "Engineering",
        country: "US",
        currency: "USD",
        salary: 100000,
        employment_type: "FULL_TIME",
        start_date: "2021-02-01",
        is_active: true
    },
    {
        employee_number: "EMP-10002",
        full_name: "Bob Clark",
        email: "bob.clark@company.test",
        job_title: "Software Engineer",
        department: "Engineering",
        country: "US",
        currency: "USD",
        salary: 120000,
        employment_type: "FULL_TIME",
        start_date: "2020-05-12",
        is_active: true
    },
    {
        employee_number: "EMP-10003",
        full_name: "Carla Diaz",
        email: "carla.diaz@company.test",
        job_title: "HR Manager",
        department: "HR",
        country: "US",
        currency: "USD",
        salary: 90000,
        employment_type: "FULL_TIME",
        start_date: "2019-08-30",
        is_active: true
    },
    {
        employee_number: "EMP-10004",
        full_name: "Dario Rossi",
        email: "dario.rossi@company.test",
        job_title: "Software Engineer",
        department: "Engineering",
        country: "IN",
        currency: "INR",
        salary: 1800000,
        employment_type: "FULL_TIME",
        start_date: "2022-01-10",
        is_active: true
    },
    {
        employee_number: "EMP-10005",
        full_name: "Elena Martin",
        email: "elena.martin@company.test",
        job_title: "HR Manager",
        department: "HR",
        country: "IN",
        currency: "INR",
        salary: 1500000,
        employment_type: "FULL_TIME",
        start_date: "2023-03-15",
        is_active: true
    }
];
(0, vitest_1.describe)("Insights API", () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, testDb_1.migrateTestDb)();
    });
    (0, vitest_1.beforeEach)(async () => {
        await (0, testDb_1.clearEmployees)();
        await (0, testDb_1.testDb)("employees").insert(fixtureRows);
    });
    (0, vitest_1.it)("returns grouped by-country metrics", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/insights/by-country");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.data).toHaveLength(2);
        const usMetrics = response.body.data.find((row) => row.country === "US");
        (0, vitest_1.expect)(usMetrics.minSalary).toBe(90000);
        (0, vitest_1.expect)(usMetrics.maxSalary).toBe(120000);
        (0, vitest_1.expect)(usMetrics.avgSalary).toBe(103333.33333333333);
        (0, vitest_1.expect)(usMetrics.count).toBe(3);
    });
    (0, vitest_1.it)("returns by-country-and-title metrics", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/insights/by-country-and-title?country=US&jobTitle=Software%20Engineer");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.data.count).toBe(2);
        (0, vitest_1.expect)(response.body.data.avgSalary).toBe(110000);
        (0, vitest_1.expect)(response.body.data.minSalary).toBe(100000);
        (0, vitest_1.expect)(response.body.data.maxSalary).toBe(120000);
    });
    (0, vitest_1.it)("returns 400 when country-and-title params are missing", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/insights/by-country-and-title?country=US");
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.error.code).toBe("VALIDATION_ERROR");
    });
    (0, vitest_1.it)("returns summary payload", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/insights/summary");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.data.totalEmployees).toBe(5);
        (0, vitest_1.expect)(response.body.data.topCountriesByAverageSalary).toHaveLength(2);
        (0, vitest_1.expect)(response.body.data.topDepartmentsByEmployeeCount[0].department).toBe("Engineering");
    });
});
