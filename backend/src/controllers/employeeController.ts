import { Request, Response } from "express";
import { employeeService } from "../services/employeeService";
import {
  CreateEmployeeDto,
  EmployeeListQueryDto,
  UpdateEmployeeDto
} from "../validators/employeeSchemas";

export const employeeController = {
  async list(req: Request, res: Response) {
    const query = res.locals.validatedQuery as EmployeeListQueryDto;
    const response = await employeeService.listEmployees(query);
    res.json(response);
  },

  async getById(req: Request, res: Response) {
    const { id } = res.locals.validatedParams as { id: string };
    const employee = await employeeService.getById(id);
    res.json({ data: employee });
  },

  async create(req: Request, res: Response) {
    const payload = req.body as CreateEmployeeDto;
    const employee = await employeeService.createEmployee(payload);
    res.status(201).json({ data: employee });
  },

  async update(req: Request, res: Response) {
    const { id } = res.locals.validatedParams as { id: string };
    const payload = req.body as UpdateEmployeeDto;
    const employee = await employeeService.updateEmployee(id, payload);
    res.json({ data: employee });
  },

  async remove(req: Request, res: Response) {
    const { id } = res.locals.validatedParams as { id: string };
    const employee = await employeeService.softDeleteEmployee(id);
    res.json({ data: employee });
  }
};
