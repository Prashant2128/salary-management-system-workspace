import { Request, Response } from "express";
import { insightsService } from "../services/insightsService";
import {
  countryAndTitleQuerySchema,
  jobTitlesQuerySchema
} from "../validators/employeeSchemas";
import { z } from "zod";

export const insightsController = {
  async byCountry(_req: Request, res: Response) {
    const data = await insightsService.byCountry();
    res.json({ data });
  },

  async byCountryAndTitle(req: Request, res: Response) {
    const { country, jobTitle } = res.locals.validatedQuery as z.infer<
      typeof countryAndTitleQuerySchema
    >;
    const data = await insightsService.byCountryAndTitle(country, jobTitle);
    res.json({ data });
  },

  async summary(_req: Request, res: Response) {
    const data = await insightsService.summary();
    res.json({ data });
  },

  async countries(_req: Request, res: Response) {
    const data = await insightsService.getCountries();
    res.json({ data });
  },

  async jobTitles(req: Request, res: Response) {
    const { country } = res.locals.validatedQuery as z.infer<typeof jobTitlesQuerySchema>;
    const data = await insightsService.getJobTitles(country);
    res.json({ data });
  }
};
