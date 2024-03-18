import {getConnection} from "./../../database/database";

const index = async(req, res) => {
    try {
        const connection = await getConnection();
        await connection.query(`SELECT id_subsidiary, subsidiary, ticket_limit, created_at, updated_at, deleted_at `+
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

const update = async(req, res) => {
    try {
        const { id_subsidiary } = req.params;
        const { subsidiary, ticket_limit } = req.body;

        if(subsidiary===undefined || ticket_limit===undefined){
            res.status(400).json({message:"Bad Request. Please fill all field."});
        }

        const su = { subsidiary, ticket_limit };
        const connection = await getConnection();
        const result = await connection.query("update subsidiaries set ?, updated_at=now() where id_subsidiary=?", [su, id_subsidiary]);
        res.json({message: "Subsidiary updated", affectedRows: result.affectedRows, updateId: id_subsidiary});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getSubsidiaryById = async(req, res) => {
    try {
        const { id_subsidiary } = req.params;
        const connection = await getConnection();
        await connection.query(`SELECT * `+
        `FROM subsidiaries `+
        `WHERE id_subsidiary = ?`, [id_subsidiary], async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
        //console.log(result)
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
    update,
    getSubsidiaryById,
    getSubsidiaryByDescription
};