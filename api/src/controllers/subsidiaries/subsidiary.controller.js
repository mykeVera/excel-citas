import {getConnection} from "./../../database/database";

const index = async(req, res) => {
    try {
        const connection = await getConnection();
        await connection.query(`SELECT id_subsidiary, subsidiary, created_at, updated_at, deleted_at `+
        `FROM subsidiaries;`, async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

const getSubsidiaryByDescription = async(req, res) => {
    try {
        const { subsidiary } = req.params;
        const connection = await getConnection();
        await connection.query(`SELECT * `+
        `FROM subsidiaries `+
        `WHERE subsidiary = ?`, [subsidiary], async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

export const methods = {
    index,
    getSubsidiaryByDescription
};