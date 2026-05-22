import { db } from "../db/knex";
import { toNullableNumber, toNumber } from "../utils/parseAggregate";

export const insightsService = {
  async byCountry() {
    const rows = (await db("employees")
      .select("country")
      .count("id as count")
      .min("salary as minSalary")
      .max("salary as maxSalary")
      .avg("salary as avgSalary")
      .sum("salary as totalPayroll")
      .select(db.raw("percentile_cont(0.5) WITHIN GROUP (ORDER BY salary) AS \"medianSalary\""))
      .where("is_active", true)
      .groupBy("country")
      .orderBy("country", "asc")) as Array<Record<string, string>>;

    return rows.map((row) => ({
      country: row.country,
      count: toNumber(row.count),
      minSalary: toNumber(row.minSalary),
      maxSalary: toNumber(row.maxSalary),
      avgSalary: toNumber(row.avgSalary),
      medianSalary: toNumber(row.medianSalary),
      totalPayroll: toNumber(row.totalPayroll)
    }));
  },

  async byCountryAndTitle(country: string, jobTitle: string) {
    const row = (await db("employees")
      .count("id as count")
      .avg("salary as avgSalary")
      .min("salary as minSalary")
      .max("salary as maxSalary")
      .where({
        country,
        job_title: jobTitle,
        is_active: true
      })
      .first()) as Record<string, string> | undefined;

    const count = toNumber(row?.count, 0);

    return {
      country,
      jobTitle,
      count,
      avgSalary: count === 0 ? null : toNullableNumber(row?.avgSalary),
      minSalary: count === 0 ? null : toNullableNumber(row?.minSalary),
      maxSalary: count === 0 ? null : toNullableNumber(row?.maxSalary)
    };
  },

  async summary() {
    const totals = (await db("employees")
      .where("is_active", true)
      .count("id as count")
      .avg("salary as avgSalary")
      .min("salary as minSalary")
      .max("salary as maxSalary")
      .first()) as Record<string, string> | undefined;

    const topCountries = (await db("employees")
      .select("country")
      .avg("salary as avgSalary")
      .count("id as count")
      .where("is_active", true)
      .groupBy("country")
      .orderBy("avgSalary", "desc")
      .limit(10)) as Array<Record<string, string>>;

    const topDepartments = (await db("employees")
      .select("department")
      .count("id as count")
      .where("is_active", true)
      .groupBy("department")
      .orderBy("count", "desc")
      .limit(10)) as Array<Record<string, string>>;

    return {
      totalEmployees: toNumber(totals?.count),
      avgSalary: toNumber(totals?.avgSalary),
      minSalary: toNumber(totals?.minSalary),
      maxSalary: toNumber(totals?.maxSalary),
      topCountriesByAverageSalary: topCountries.map((countryRow) => ({
        country: countryRow.country,
        avgSalary: toNumber(countryRow.avgSalary),
        count: toNumber(countryRow.count)
      })),
      topDepartmentsByEmployeeCount: topDepartments.map((departmentRow) => ({
        department: departmentRow.department,
        count: toNumber(departmentRow.count)
      }))
    };
  },

  async getJobTitles(country?: string) {
    const query = db("employees")
      .distinct("job_title")
      .where("is_active", true)
      .orderBy("job_title", "asc");

    if (country) {
      query.andWhere({ country });
    }

    const rows = await query;
    return rows.map((row) => row.job_title as string);
  },

  async getCountries() {
    const rows = await db("employees")
      .distinct("country")
      .where("is_active", true)
      .orderBy("country", "asc");

    return rows.map((row) => row.country as string);
  }
};
