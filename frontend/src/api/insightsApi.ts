import { apiClient } from "./client";
import { ApiEnvelope } from "../types/api";
import { CountryInsight, CountryTitleInsight, SummaryInsight } from "../types/employee";

export const insightsApi = {
  async byCountry() {
    const response = await apiClient.get<ApiEnvelope<CountryInsight[]>>("/insights/by-country");
    return response.data.data;
  },

  async byCountryAndTitle(country: string, jobTitle: string) {
    const response = await apiClient.get<ApiEnvelope<CountryTitleInsight>>(
      "/insights/by-country-and-title",
      { params: { country, jobTitle } }
    );
    return response.data.data;
  },

  async summary() {
    const response = await apiClient.get<ApiEnvelope<SummaryInsight>>("/insights/summary");
    return response.data.data;
  },

  async countries() {
    const response = await apiClient.get<ApiEnvelope<string[]>>("/insights/countries");
    return response.data.data;
  },

  async jobTitles(country?: string) {
    const response = await apiClient.get<ApiEnvelope<string[]>>("/insights/job-titles", {
      params: country ? { country } : undefined
    });
    return response.data.data;
  }
};
