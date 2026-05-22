import { Router } from "express";
import { employeeController } from "../controllers/employeeController";
import { validateBody, validateParams, validateQuery } from "../middleware/validate";
import {
  createEmployeeSchema,
  employeeIdParamSchema,
  employeeListQuerySchema,
  updateEmployeeSchema
} from "../validators/employeeSchemas";

export const employeeRoutes = Router();

employeeRoutes.get("/", validateQuery(employeeListQuerySchema), employeeController.list);
employeeRoutes.get(
  "/:id",
  validateParams(employeeIdParamSchema),
  employeeController.getById
);
employeeRoutes.post("/", validateBody(createEmployeeSchema), employeeController.create);
employeeRoutes.put(
  "/:id",
  validateParams(employeeIdParamSchema),
  validateBody(updateEmployeeSchema),
  employeeController.update
);
employeeRoutes.delete(
  "/:id",
  validateParams(employeeIdParamSchema),
  employeeController.remove
);
