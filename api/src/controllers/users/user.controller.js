import {getConnection} from "./../../database/database";
import config from "./../../config";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const login = async(req, res) => {
    try {
        const { user, pass } = req.body;

        if(user===undefined || pass===undefined){
            res.status(400).json({message:"Bad Request. Please fill all field."});
        }
        
        const connection = await getConnection();
        connection.query("SELECT u.id_user,u.lastname,u.firstname,u.user,u.pass,u.id_type_user,u.id_subsidiary,s.subsidiary "+
        "FROM users u "+
        "LEFT JOIN subsidiaries s on s.id_subsidiary=u.id_subsidiary "+
        "WHERE u.user=? AND isnull(u.deleted_at)", [user], async (error, results)=>{
            if(results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass))){
                //res.status(400).send("credenciales incorrectas");
                res.send("Credenciales incorrectas");
            }else{
                const u = {
                    id_user: results[0].id_user,
                    lastname: results[0].lastname,
                    firstname: results[0].firstname,
                    user: results[0].user,
                    id_type_user: results[0].id_type_user,
                    id_subsidiary: results[0].id_subsidiary,
                    subsidiary: results[0].subsidiary,
                };
                const token = jwt.sign(
                    {id_user:u.id_user, lastname:u.lastname, firstname:u.firstname , id_type_user:u.id_type_user, id_subsidiary: u.id_subsidiary, subsidiary: u.subsidiary},
                    config.jwt_key,
                    {expiresIn:config.jwt_time_expire}
                );
                let nDatos = {...u, token};
                res.status(200).json(nDatos);
            }
        });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const authenticated = async(req, res) => {
    try {
        const { id_user, user } = req.body;
        const connection = await getConnection();
        await connection.query("select id_user,user from users where id_user=? and user=? and isnull(deleted_at)", [id_user, user], async (error, results)=>{
            if(!results.length ==0){
                res.json(results);
            }else{
                res.send("Not Authenticated");
            }
        });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

const index = async(req, res) => {
    try {
        const connection = await getConnection();
        await connection.query(`SELECT u.id_user,u.lastname,u.firstname,u.user,IF(u.id_type_user=1,'ADMINISTRADOR',IF(u.id_type_user=2,'COLABORADOR','SIN TIPO DE USUARIO')) AS type_user,u.id_subsidiary,s.subsidiary `+
        `FROM users u `+
        `LEFT JOIN subsidiaries s on s.id_subsidiary=u.id_subsidiary `+
        `WHERE isnull(u.deleted_at) and user!='admin'`, async (err, result, fields) => {
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

const getUserById = async(req, res) => {
    try {
        const { id_user } = req.params;
        const connection = await getConnection();
        await connection.query(`SELECT u.id_user,u.lastname,u.firstname,u.user,u.id_type_user,u.id_subsidiary,s.subsidiary `+
        `FROM users u `+
        `LEFT JOIN subsidiaries s ON s.id_subsidiary=u.id_subsidiary `+
        `WHERE id_user=? AND isnull(u.deleted_at)`, [id_user], async (err, result) => {
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

const store = async(req, res) => {
    try {
        const { lastname, firstname, user, pass, id_type_user, id_subsidiary } = req.body;

        if(lastname===undefined || firstname===undefined || user===undefined || pass===undefined || id_type_user===undefined || id_subsidiary===undefined){
            res.status(400).json({message:"Bad Request. Please fill all field."});
        }
        
        let passHash = await bcryptjs.hash(pass, 8);
        const us = { lastname, firstname, user, pass:passHash, id_type_user, id_subsidiary };
        const connection = await getConnection();
        const result = await connection.query("insert into users set ?, created_at=now()", us);
        res.json({message: "User added", insertId: result.insertId});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
};

const update = async(req, res) => {
    try {
        const { id_user } = req.params;
        const { lastname, firstname, user, id_type_user, id_subsidiary } = req.body;

        if(lastname===undefined || firstname===undefined || user===undefined || id_type_user===undefined || id_subsidiary===undefined){
            res.status(400).json({message:"Bad Request. Please fill all field."});
        }

        const us = { lastname, firstname, user, id_type_user, id_subsidiary };
        const connection = await getConnection();
        const result = await connection.query("update users set ?, updated_at=now() where id_user=?", [us, id_user]);
        res.json({message: "User updated", affectedRows: result.affectedRows, updateId: id_user});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const passwordChange = async(req, res) => {
    try {
        const { id_user } = req.params
        const { pass } = req.body;

        if(pass===undefined){
            res.status(400).json({message:"Bad Request. Please fill all field."});
        }

        let passHash = await bcryptjs.hash(pass, 8);
        const us = { pass:passHash };
        const connection = await getConnection();
        const result = await connection.query("update users set ? where id_user=?", [us, id_user]);
        res.json({message: "Updated password", affectedRows: result.affectedRows, updateId: id_user});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const softdelete = async(req, res) => {
    try {
        const { id_user } = req.params;
        const connection = await getConnection();
        const result = await connection.query("update users set deleted_at=now() where id_user=?", id_user);
        res.json({message: "User deleted", affectedRows: result.affectedRows, deleteId: id_user});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    login,
    authenticated,
    index,
    getUserById,
    store,
    update,
    passwordChange,
    softdelete
};