// knex setup
import Knex from "knex";
const knexConfigs = require("../knexfile");
let configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);
