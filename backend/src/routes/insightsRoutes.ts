import { Router } from "express";
import { insightsController } from "../controllers/insightsController";
import { validateQuery } from "../middleware/validate";
import { countryAndTitleQuerySchema, jobTitlesQuerySchema } from "../validators/employeeSchemas";

export const insightsRoutes = Router();

insightsRoutes.get("/by-country", insightsController.byCountry);
insightsRoutes.get(
  "/by-country-and-title",
  validateQuery(countryAndTitleQuerySchema),
  insightsController.byCountryAndTitle
);
insightsRoutes.get("/summary", insightsController.summary);
insightsRoutes.get("/countries", insightsController.countries);
insightsRoutes.get("/job-titles", validateQuery(jobTitlesQuerySchema), insightsController.jobTitles);
