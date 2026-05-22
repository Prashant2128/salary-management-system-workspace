import { apiClient } from "./client";
import { ApiEnvelope, PaginatedEnvelope } from "../types/api";
import { CreateEmployeePayload, Employee, UpdateEmployeePayload } from "../types/employee";

export interface EmployeeQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  country?: string;
  jobTitle?: string;
  department?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const employeesApi = {
  async list(params: EmployeeQueryParams) {
    const response = await apiClient.get<PaginatedEnvelope<Employee>>("/employees", { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiEnvelope<Employee>>(`/employees/${id}`);
    return response.data.data;
  },

  async create(payload: CreateEmployeePayload) {
    const response = await apiClient.post<ApiEnvelope<Employee>>("/employees", payload);
    return response.data.data;
  },

  async update(id: string, payload: UpdateEmployeePayload) {
    const response = await apiClient.put<ApiEnvelope<Employee>>(`/employees/${id}`, payload);
    return response.data.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete<ApiEnvelope<Employee>>(`/employees/${id}`);
    return response.data.data;
  }
};
