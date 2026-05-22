"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeController = void 0;
const employeeService_1 = require("../services/employeeService");
exports.employeeController = {
    async list(req, res) {
        const query = res.locals.validatedQuery;
        const response = await employeeService_1.employeeService.listEmployees(query);
        res.json(response);
    },
    async getById(req, res) {
        const { id } = res.locals.validatedParams;
        const employee = await employeeService_1.employeeService.getById(id);
        res.json({ data: employee });
    },
    async create(req, res) {
        const payload = req.body;
        const employee = await employeeService_1.employeeService.createEmployee(payload);
        res.status(201).json({ data: employee });
    },
    async update(req, res) {
        const { id } = res.locals.validatedParams;
        const payload = req.body;
        const employee = await employeeService_1.employeeService.updateEmployee(id, payload);
        res.json({ data: employee });
    },
    async remove(req, res) {
        const { id } = res.locals.validatedParams;
        const employee = await employeeService_1.employeeService.softDeleteEmployee(id);
        res.json({ data: employee });
    }
};
