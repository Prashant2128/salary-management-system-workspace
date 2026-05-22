import { useCallback, useEffect, useState } from "react";
import { insightsApi } from "../api/insightsApi";

export const useCountryJobTitleFilters = (selectedCountry: string) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadCountries = useCallback(async () => {
    const countryList = await insightsApi.countries();
    setCountries(countryList);
  }, []);

  const loadJobTitles = useCallback(async (country?: string) => {
    const titles = await insightsApi.jobTitles(country);
    setJobTitles(titles);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setError(null);
        await Promise.all([loadCountries(), loadJobTitles()]);
      } catch (requestError) {
        setError((requestError as Error).message);
      }
    };
    void bootstrap();
  }, [loadCountries, loadJobTitles]);

  useEffect(() => {
    const refreshTitles = async () => {
      try {
        setError(null);
        await loadJobTitles(selectedCountry || undefined);
      } catch (requestError) {
        setError((requestError as Error).message);
      }
    };
    void refreshTitles();
  }, [loadJobTitles, selectedCountry]);

  return { countries, jobTitles, error };
};
