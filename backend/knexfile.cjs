require("dotenv").config();

const sharedConfig = {
  client: "pg",
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: "./migrations"
  }
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: process.env.DATABASE_URL
  },
  test: {
    ...sharedConfig,
    connection: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
  },
  production: {
    ...sharedConfig,
    connection: process.env.DATABASE_URL
  }
};
