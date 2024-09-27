const dotenv = require("dotenv");
const program = require ("../utils/commander.js");
const { mongo } = require("mongoose");


dotenv.config(
    {
        path: mode === "desarrollo" ? "./.env.desarrollo" : "./.env.produccion"
    }
);
configObject = {
    puerto: process.env.PUERTO,
    mongo_url: process.env.MONGO_URL,
}