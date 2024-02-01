import {createPool} from "mysql";
import config from "./../config";

const pool=createPool({
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_database,
    connectionLimit: config.db_connectionLimit
});

const getConnection= (e)=>{
    return  pool;
}

module.exports = {
    getConnection
};