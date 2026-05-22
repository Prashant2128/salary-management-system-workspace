"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const validateBody = (schema) => (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
};
exports.validateBody = validateBody;
const validateQuery = (schema) => (req, res, next) => {
    res.locals.validatedQuery = schema.parse(req.query);
    next();
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => (req, res, next) => {
    res.locals.validatedParams = schema.parse(req.params);
    next();
};
exports.validateParams = validateParams;
