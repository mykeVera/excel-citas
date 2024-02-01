import {config} from "dotenv";

config();

export default {
    db_host: process.env.DB_HOST || "",
    db_user: process.env.DB_USER || "",
    db_password: process.env.DB_PASSWORD || "",
    db_database: process.env.DB_DATABASE || "",
    db_connectionLimit: process.env.DB_CONNECTION_LIMIT || ""
}