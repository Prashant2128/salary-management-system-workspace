"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
const testDb_1 = require("./testDb");
const validEmployeePayload = {
    employeeNumber: "EMP-99999",
    fullName: "Alex Morgan",
    email: "alex.morgan99999@company.test",
    jobTitle: "Software Engineer",
    department: "Engineering",
    country: "US",
    currency: "USD",
    salary: 95000,
    employmentType: "FULL_TIME",
    startDate: "2020-01-01"
};
(0, vitest_1.describe)("Employees API", () => {
    (0, vitest_1.beforeAll)(async () => {
        await (0, testDb_1.migrateTestDb)();
    });
    (0, vitest_1.beforeEach)(async () => {
        await (0, testDb_1.clearEmployees)();
    });
    (0, vitest_1.it)("creates an employee", async () => {
        const response = await (0, supertest_1.default)(app_1.app).post("/api/employees").send(validEmployeePayload);
        (0, vitest_1.expect)(response.status).toBe(201);
        (0, vitest_1.expect)(response.body.data.fullName).toBe(validEmployeePayload.fullName);
        (0, vitest_1.expect)(response.body.data.isActive).toBe(true);
    });
    (0, vitest_1.it)("returns validation error for invalid salary", async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .post("/api/employees")
            .send({ ...validEmployeePayload, employeeNumber: "EMP-99998", salary: -1000 });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.error.code).toBe("VALIDATION_ERROR");
    });
    (0, vitest_1.it)("supports get, update, and soft delete", async () => {
        const created = await (0, supertest_1.default)(app_1.app).post("/api/employees").send(validEmployeePayload);
        const employeeId = created.body.data.id;
        const getResponse = await (0, supertest_1.default)(app_1.app).get(`/api/employees/${employeeId}`);
        (0, vitest_1.expect)(getResponse.status).toBe(200);
        (0, vitest_1.expect)(getResponse.body.data.employeeNumber).toBe("EMP-99999");
        const updateResponse = await (0, supertest_1.default)(app_1.app).put(`/api/employees/${employeeId}`).send({
            salary: 100000
        });
        (0, vitest_1.expect)(updateResponse.status).toBe(200);
        (0, vitest_1.expect)(updateResponse.body.data.salary).toBe(100000);
        const deleteResponse = await (0, supertest_1.default)(app_1.app).delete(`/api/employees/${employeeId}`);
        (0, vitest_1.expect)(deleteResponse.status).toBe(200);
        (0, vitest_1.expect)(deleteResponse.body.data.isActive).toBe(false);
        const listResponse = await (0, supertest_1.default)(app_1.app).get("/api/employees");
        (0, vitest_1.expect)(listResponse.status).toBe(200);
        (0, vitest_1.expect)(listResponse.body.data).toHaveLength(0);
        const includeInactiveResponse = await (0, supertest_1.default)(app_1.app).get("/api/employees?includeInactive=true");
        (0, vitest_1.expect)(includeInactiveResponse.body.data).toHaveLength(1);
    });
    (0, vitest_1.it)("supports pagination metadata", async () => {
        const payloads = [1, 2, 3].map((index) => ({
            ...validEmployeePayload,
            employeeNumber: `EMP-9900${index}`,
            email: `alex${index}@company.test`
        }));
        await (0, testDb_1.testDb)("employees").insert(payloads.map((payload) => ({
            employee_number: payload.employeeNumber,
            full_name: payload.fullName,
            email: payload.email,
            job_title: payload.jobTitle,
            department: payload.department,
            country: payload.country,
            currency: payload.currency,
            salary: payload.salary,
            employment_type: payload.employmentType,
            start_date: payload.startDate,
            is_active: true
        })));
        const response = await (0, supertest_1.default)(app_1.app).get("/api/employees?page=2&pageSize=2");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.data).toHaveLength(1);
        (0, vitest_1.expect)(response.body.meta.total).toBe(3);
        (0, vitest_1.expect)(response.body.meta.totalPages).toBe(2);
    });
    (0, vitest_1.it)("returns 404 for unknown employee", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/employees/00000000-0000-4000-8000-000000000000");
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body.error.code).toBe("EMPLOYEE_NOT_FOUND");
    });
});
