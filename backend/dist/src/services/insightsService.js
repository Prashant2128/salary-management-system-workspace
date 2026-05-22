"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insightsService = void 0;
const knex_1 = require("../db/knex");
const parseAggregate_1 = require("../utils/parseAggregate");
exports.insightsService = {
    async byCountry() {
        const rows = (await (0, knex_1.db)("employees")
            .select("country")
            .count("id as count")
            .min("salary as minSalary")
            .max("salary as maxSalary")
            .avg("salary as avgSalary")
            .sum("salary as totalPayroll")
            .select(knex_1.db.raw("percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) AS \"medianSalary\""))
            .where("is_active", true)
            .groupBy("country")
            .orderBy("country", "asc"));
        return rows.map((row) => ({
            country: row.country,
            count: (0, parseAggregate_1.toNumber)(row.count),
            minSalary: (0, parseAggregate_1.toNumber)(row.minSalary),
            maxSalary: (0, parseAggregate_1.toNumber)(row.maxSalary),
            avgSalary: (0, parseAggregate_1.toNumber)(row.avgSalary),
            medianSalary: (0, parseAggregate_1.toNumber)(row.medianSalary),
            totalPayroll: (0, parseAggregate_1.toNumber)(row.totalPayroll)
        }));
    },
    async byCountryAndTitle(country, jobTitle) {
        const row = (await (0, knex_1.db)("employees")
            .count("id as count")
            .avg("salary as avgSalary")
            .min("salary as minSalary")
            .max("salary as maxSalary")
            .where({
            country,
            job_title: jobTitle,
            is_active: true
        })
            .first());
        const count = (0, parseAggregate_1.toNumber)(row?.count, 0);
        return {
            country,
            jobTitle,
            count,
            avgSalary: count === 0 ? null : (0, parseAggregate_1.toNullableNumber)(row?.avgSalary),
            minSalary: count === 0 ? null : (0, parseAggregate_1.toNullableNumber)(row?.minSalary),
            maxSalary: count === 0 ? null : (0, parseAggregate_1.toNullableNumber)(row?.maxSalary)
        };
    },
    async summary() {
        const totals = (await (0, knex_1.db)("employees")
            .where("is_active", true)
            .count("id as count")
            .avg("salary as avgSalary")
            .min("salary as minSalary")
            .max("salary as maxSalary")
            .first());
        const topCountries = (await (0, knex_1.db)("employees")
            .select("country")
            .avg("salary as avgSalary")
            .count("id as count")
            .where("is_active", true)
            .groupBy("country")
            .orderBy("avgSalary", "desc")
            .limit(10));
        const topDepartments = (await (0, knex_1.db)("employees")
            .select("department")
            .count("id as count")
            .where("is_active", true)
            .groupBy("department")
            .orderBy("count", "desc")
            .limit(10));
        return {
            totalEmployees: (0, parseAggregate_1.toNumber)(totals?.count),
            avgSalary: (0, parseAggregate_1.toNumber)(totals?.avgSalary),
            minSalary: (0, parseAggregate_1.toNumber)(totals?.minSalary),
            maxSalary: (0, parseAggregate_1.toNumber)(totals?.maxSalary),
            topCountriesByAverageSalary: topCountries.map((countryRow) => ({
                country: countryRow.country,
                avgSalary: (0, parseAggregate_1.toNumber)(countryRow.avgSalary),
                count: (0, parseAggregate_1.toNumber)(countryRow.count)
            })),
            topDepartmentsByEmployeeCount: topDepartments.map((departmentRow) => ({
                department: departmentRow.department,
                count: (0, parseAggregate_1.toNumber)(departmentRow.count)
            }))
        };
    },
    async getJobTitles(country) {
        const query = (0, knex_1.db)("employees")
            .distinct("job_title")
            .where("is_active", true)
            .orderBy("job_title", "asc");
        if (country) {
            query.andWhere({ country });
        }
        const rows = await query;
        return rows.map((row) => row.job_title);
    },
    async getCountries() {
        const rows = await (0, knex_1.db)("employees")
            .distinct("country")
            .where("is_active", true)
            .orderBy("country", "asc");
        return rows.map((row) => row.country);
    }
};
