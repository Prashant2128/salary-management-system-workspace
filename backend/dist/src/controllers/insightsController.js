"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insightsController = void 0;
const insightsService_1 = require("../services/insightsService");
exports.insightsController = {
    async byCountry(_req, res) {
        const data = await insightsService_1.insightsService.byCountry();
        res.json({ data });
    },
    async byCountryAndTitle(req, res) {
        const { country, jobTitle } = res.locals.validatedQuery;
        const data = await insightsService_1.insightsService.byCountryAndTitle(country, jobTitle);
        res.json({ data });
    },
    async summary(_req, res) {
        const data = await insightsService_1.insightsService.summary();
        res.json({ data });
    },
    async countries(_req, res) {
        const data = await insightsService_1.insightsService.getCountries();
        res.json({ data });
    },
    async jobTitles(req, res) {
        const { country } = res.locals.validatedQuery;
        const data = await insightsService_1.insightsService.getJobTitles(country);
        res.json({ data });
    }
};
