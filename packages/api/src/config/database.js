"use strict";

const path = require("path");
const { URL } = require("url");
require("dotenv").config({
  path: path.resolve(__dirname, "../../../../.env"),
});

function parseDbUrl(dbUrl) {
  const parsed = new URL(dbUrl);

  return {
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.slice(1),
    host: parsed.hostname,
    port: parseInt(parsed.port || "5432", 10),

    dialect: "postgres",

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    migrationStorage: "sequelize",
    seederStorage: "sequelize",
  };
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not defined");
}

module.exports = {
  development: parseDbUrl(dbUrl),
  test: parseDbUrl(dbUrl),
  production: parseDbUrl(dbUrl),
};