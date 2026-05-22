import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { testDb, clearEmployees, migrateTestDb } from "./testDb";

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

describe("Employees API", () => {
  beforeAll(async () => {
    await migrateTestDb();
  });

  beforeEach(async () => {
    await clearEmployees();
  });

  it("creates an employee", async () => {
    const response = await request(app).post("/api/employees").send(validEmployeePayload);

    expect(response.status).toBe(201);
    expect(response.body.data.fullName).toBe(validEmployeePayload.fullName);
    expect(response.body.data.isActive).toBe(true);
  });

  it("returns validation error for invalid salary", async () => {
    const response = await request(app)
      .post("/api/employees")
      .send({ ...validEmployeePayload, employeeNumber: "EMP-99998", salary: -1000 });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("supports get, update, and soft delete", async () => {
    const created = await request(app).post("/api/employees").send(validEmployeePayload);
    const employeeId = created.body.data.id;

    const getResponse = await request(app).get(`/api/employees/${employeeId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.employeeNumber).toBe("EMP-99999");

    const updateResponse = await request(app).put(`/api/employees/${employeeId}`).send({
      salary: 100000
    });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.salary).toBe(100000);

    const deleteResponse = await request(app).delete(`/api/employees/${employeeId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.data.isActive).toBe(false);

    const listResponse = await request(app).get("/api/employees");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(0);

    const includeInactiveResponse = await request(app).get("/api/employees?includeInactive=true");
    expect(includeInactiveResponse.body.data).toHaveLength(1);
  });

  it("supports pagination metadata", async () => {
    const payloads = [1, 2, 3].map((index) => ({
      ...validEmployeePayload,
      employeeNumber: `EMP-9900${index}`,
      email: `alex${index}@company.test`
    }));
    await testDb("employees").insert(
      payloads.map((payload) => ({
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
      }))
    );

    const response = await request(app).get("/api/employees?page=2&pageSize=2");
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.total).toBe(3);
    expect(response.body.meta.totalPages).toBe(2);
  });

  it("returns 404 for unknown employee", async () => {
    const response = await request(app).get(
      "/api/employees/00000000-0000-4000-8000-000000000000"
    );
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("EMPLOYEE_NOT_FOUND");
  });
});
