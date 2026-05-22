"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const knex_1 = __importDefault(require("knex"));
const employee_1 = require("../src/constants/employee");
dotenv_1.default.config();
const BATCH_SIZE = 1000;
const TARGET_EMPLOYEE_COUNT = 10000;
const JOB_TITLES = [
    "Software Engineer",
    "Senior Software Engineer",
    "Engineering Manager",
    "Product Manager",
    "Senior Product Manager",
    "QA Engineer",
    "Data Analyst",
    "Data Scientist",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "UI Designer",
    "UX Researcher",
    "HR Specialist",
    "HR Manager",
    "Recruiter",
    "Sales Executive",
    "Sales Manager",
    "Account Manager",
    "Financial Analyst",
    "Finance Manager",
    "Operations Analyst",
    "Operations Manager",
    "Marketing Specialist",
    "Marketing Manager",
    "Content Strategist",
    "Legal Counsel",
    "Compliance Officer",
    "Customer Support Specialist",
    "Technical Support Engineer",
    "Business Analyst",
    "Project Coordinator",
    "Procurement Specialist",
    "Security Analyst",
    "Payroll Specialist",
    "Compensation Analyst"
];
const COUNTRY_SETTINGS = [
    { country: "US", currency: "USD", minSalary: 45000, maxSalary: 220000 },
    { country: "CA", currency: "CAD", minSalary: 50000, maxSalary: 190000 },
    { country: "GB", currency: "GBP", minSalary: 32000, maxSalary: 160000 },
    { country: "DE", currency: "EUR", minSalary: 38000, maxSalary: 170000 },
    { country: "FR", currency: "EUR", minSalary: 35000, maxSalary: 150000 },
    { country: "NL", currency: "EUR", minSalary: 36000, maxSalary: 165000 },
    { country: "SE", currency: "SEK", minSalary: 380000, maxSalary: 1400000 },
    { country: "NO", currency: "NOK", minSalary: 420000, maxSalary: 1500000 },
    { country: "IN", currency: "INR", minSalary: 600000, maxSalary: 5500000 },
    { country: "SG", currency: "SGD", minSalary: 55000, maxSalary: 230000 },
    { country: "AU", currency: "AUD", minSalary: 70000, maxSalary: 250000 },
    { country: "JP", currency: "JPY", minSalary: 4500000, maxSalary: 18000000 },
    { country: "BR", currency: "BRL", minSalary: 45000, maxSalary: 320000 },
    { country: "AE", currency: "AED", minSalary: 120000, maxSalary: 700000 },
    { country: "ZA", currency: "ZAR", minSalary: 280000, maxSalary: 1600000 },
    { country: "ES", currency: "EUR", minSalary: 32000, maxSalary: 145000 },
    { country: "IT", currency: "EUR", minSalary: 30000, maxSalary: 140000 },
    { country: "MX", currency: "MXN", minSalary: 420000, maxSalary: 2800000 }
];
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is required before running seed script.");
}
const db = (0, knex_1.default)({
    client: "pg",
    connection: databaseUrl
});
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = (list) => list[randomInt(0, list.length - 1)];
const parseArgFlag = (flag) => process.argv.slice(2).includes(flag);
const loadNames = (fileName) => {
    const filePath = path_1.default.join(__dirname, "..", "data", fileName);
    const content = fs_1.default.readFileSync(filePath, "utf-8");
    return content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
};
const createStartDate = () => {
    const now = new Date();
    const yearsAgo = randomInt(0, 10);
    const monthsAgo = randomInt(0, 11);
    const daysAgo = randomInt(0, 27);
    const date = new Date(now.getFullYear() - yearsAgo, now.getMonth() - monthsAgo, now.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
};
const createSalary = (minSalary, maxSalary) => {
    const base = randomInt(minSalary, maxSalary);
    return (Math.round(base * 100) / 100).toFixed(2);
};
const normalizeName = (value) => value.toLowerCase().replace(/[^a-z]/g, "");
const run = async () => {
    const reset = parseArgFlag("--reset");
    const force = parseArgFlag("--force");
    const start = Date.now();
    const firstNames = loadNames("first_names.txt");
    const lastNames = loadNames("last_names.txt");
    if (firstNames.length < 100 || lastNames.length < 100) {
        throw new Error("Both first_names.txt and last_names.txt must contain at least 100 names.");
    }
    const [{ count }] = await db("employees").count("id as count");
    const currentCount = Number(count ?? 0);
    if (reset) {
        await db("employees").del();
    }
    else if (currentCount >= TARGET_EMPLOYEE_COUNT && !force) {
        // eslint-disable-next-line no-console
        console.log(`Seed skipped: employee count is already ${currentCount}. Use --force or --reset.`);
        await db.destroy();
        return;
    }
    const rows = [];
    for (let index = 0; index < TARGET_EMPLOYEE_COUNT; index += 1) {
        const firstName = randomPick(firstNames);
        const lastName = randomPick(lastNames);
        const countryInfo = randomPick(COUNTRY_SETTINGS);
        const fullName = `${firstName} ${lastName}`;
        const employeeNumber = `EMP-${String(index + 1).padStart(5, "0")}`;
        const email = `${normalizeName(firstName)}.${normalizeName(lastName)}${index + 1}@company.test`;
        rows.push({
            employee_number: employeeNumber,
            full_name: fullName,
            email,
            job_title: randomPick(JOB_TITLES),
            department: randomPick([...employee_1.DEPARTMENTS]),
            country: countryInfo.country,
            currency: countryInfo.currency,
            salary: createSalary(countryInfo.minSalary, countryInfo.maxSalary),
            employment_type: randomPick([...employee_1.EMPLOYMENT_TYPES]),
            start_date: createStartDate(),
            is_active: true
        });
    }
    for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
        const batch = rows.slice(offset, offset + BATCH_SIZE);
        await db.transaction(async (trx) => {
            await trx("employees").insert(batch);
        });
    }
    const elapsed = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(`Seeded ${TARGET_EMPLOYEE_COUNT} employees in ${elapsed} ms.`);
    await db.destroy();
};
run().catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error("Seeding failed:", error);
    await db.destroy();
    process.exit(1);
});
