/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema.createTable("employees", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("employee_number", 16).notNullable().unique();
    table.string("full_name", 120).notNullable();
    table.string("email", 160).notNullable().unique();
    table.string("job_title", 120).notNullable();
    table.string("department", 60).notNullable();
    table.string("country", 2).notNullable();
    table.string("currency", 3).notNullable();
    table.decimal("salary", 12, 2).notNullable();
    table.string("employment_type", 20).notNullable();
    table.date("start_date").notNullable();
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.raw(`
    ALTER TABLE employees
    ADD CONSTRAINT employees_employment_type_check
    CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT'))
  `);
  await knex.raw(`
    CREATE INDEX employees_country_idx ON employees (country);
    CREATE INDEX employees_job_title_idx ON employees (job_title);
    CREATE INDEX employees_department_idx ON employees (department);
    CREATE INDEX employees_email_idx ON employees (email);
    CREATE INDEX employees_employee_number_idx ON employees (employee_number);
    CREATE INDEX employees_is_active_idx ON employees (is_active);
    CREATE INDEX employees_full_name_idx ON employees (full_name);
  `);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("employees");
};
