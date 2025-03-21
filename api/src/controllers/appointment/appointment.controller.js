import {getConnection} from "./../../database/database";

const index = async(req, res) => {
    try {
        const connection = await getConnection();
        await connection.query("SELECT * "+
        "FROM appointments "+
        "WHERE date_programing = DATE(NOW()) AND deleted_at IS NULL", async (err, result, fields) => {
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

const getAppointmentAll = async(req, res) => {
    
    try {
        const { date1 } = req.params;
        const { date2 } = req.params;
        const connection = await getConnection();
        await connection.query("SELECT a.id_appointment, DATE_FORMAT(a.date_programing,'%d/%m/%Y') as date_programing, a.nro_documento,"+
        "a.last_name, a.first_name, a.company, a.subcontract, a.protocol, a.examen_type, a.area, a.job_position,"+
        "a.project, a.cost_center, a.person_programmed, a.observation, a.ticket_time_init, a.ticket_time_finish,"+
        "a.ticket_generate, a.in_excel_programing, a.id_subsidiary, s.subsidiary,"+
        "DATE_FORMAT(a.created_at,'%d/%m/%Y %H:%i:%S') as created_at,"+
        "DATE_FORMAT(a.updated_at,'%d/%m/%Y %H:%i:%S') as updated_at,"+
        "DATE_FORMAT(a.deleted_at,'%d/%m/%Y %H:%i:%S') as deleted_at "+
        "FROM appointments a "+
        "LEFT JOIN subsidiaries s ON s.id_subsidiary=a.id_subsidiary "+
        "WHERE a.deleted_at IS NULL AND date(a.created_at) between ? AND ?", [date1, date2], async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

const getAppointmentById = async(req, res) => {
    
    try {
        const { id_appointment } = req.params;
        const { subsidiary } = req.params;
        const connection = await getConnection();
        await connection.query("SELECT a.id_appointment, DATE_FORMAT(a.date_programing,'%d/%m/%Y') as date_programing, a.nro_documento,"+
        "a.last_name, a.first_name, a.company, a.subcontract, a.protocol, a.examen_type, a.area, a.job_position,"+
        "a.project, a.cost_center, a.person_programmed, a.observation, a.ticket_time_init, a.ticket_time_finish,"+
        "a.ticket_generate, a.in_excel_programing, a.id_subsidiary, s.subsidiary,"+
        "DATE_FORMAT(a.created_at,'%d/%m/%Y %H:%i:%S') as create_at,"+
        "DATE_FORMAT(a.updated_at,'%d/%m/%Y %H:%i:%S') as update_at,"+
        "DATE_FORMAT(a.deleted_at,'%d/%m/%Y %H:%i:%S') as deleted_at "+
        "FROM appointments a "+
        "LEFT JOIN subsidiaries s ON s.id_subsidiary=a.id_subsidiary "+
        "WHERE a.date_programing = DATE(NOW()) "+
        "AND a.id_appointment = ? AND a.deleted_at IS NULL "+
        "LIMIT 1", [id_appointment], async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

const getAppointmentByNroDocument = async(req, res) => {
    
    try {
        const { nro_document } = req.params;
        const connection = await getConnection();
        await connection.query("SELECT a.id_appointment, DATE_FORMAT(a.date_programing,'%d/%m/%Y') as date_programing, a.nro_documento,"+
        "a.last_name, a.first_name, a.company, a.subcontract, a.protocol, a.examen_type, a.area, a.job_position,"+
        "a.project, a.cost_center, a.person_programmed, a.observation, a.ticket_time_init, a.ticket_time_finish,"+
        "a.ticket_generate, a.in_excel_programing, a.id_subsidiary, s.subsidiary,"+
        "DATE_FORMAT(a.created_at,'%d/%m/%Y %H:%i:%S') as create_at,"+
        "DATE_FORMAT(a.updated_at,'%d/%m/%Y %H:%i:%S') as update_at,"+
        "DATE_FORMAT(a.deleted_at,'%d/%m/%Y %H:%i:%S') as deleted_at "+
        "FROM appointments a "+
        "LEFT JOIN subsidiaries s ON s.id_subsidiary=a.id_subsidiary "+
        "WHERE a.date_programing = DATE(NOW()) "+
        "AND a.nro_documento = ? AND a.deleted_at IS NULL"+
        "LIMIT 1", [nro_document], async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

const getAppointmentAllByNroDocument = async(req, res) => {
    
    try {
        const { nro_document } = req.params;
        const connection = await getConnection();
        await connection.query("SELECT a.id_appointment, DATE_FORMAT(a.date_programing,'%d/%m/%Y') as date_programing, a.nro_documento,"+
        "a.last_name, a.first_name, a.company, a.subcontract, a.protocol, a.examen_type, a.area, a.job_position,"+
        "a.project, a.cost_center, a.person_programmed, a.observation, a.ticket_time_init, a.ticket_time_finish,"+
        "a.ticket_generate, a.in_excel_programing, a.id_subsidiary, s.subsidiary,"+
        "DATE_FORMAT(a.created_at,'%d/%m/%Y %H:%i:%S') as create_at,"+
        "DATE_FORMAT(a.updated_at,'%d/%m/%Y %H:%i:%S') as update_at,"+
        "DATE_FORMAT(a.deleted_at,'%d/%m/%Y %H:%i:%S') as deleted_at "+
        "FROM appointments a "+
        "LEFT JOIN subsidiaries s ON s.id_subsidiary=a.id_subsidiary "+
        "WHERE a.nro_documento = ? AND a.deleted_at IS NULL", [nro_document], async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

const getAppointmentByNroDocumentAndSubsidiary = async(req, res) => {
    
    try {
        const { nro_document } = req.params;
        const { subsidiary } = req.params;
        const connection = await getConnection();
        await connection.query("SELECT a.id_appointment, DATE_FORMAT(a.date_programing,'%d/%m/%Y') as date_programing, a.nro_documento,"+
        "a.last_name, a.first_name, a.company, a.subcontract, a.protocol, a.examen_type, a.area, a.job_position,"+
        "a.in_excel_programing, a.id_subsidiary, s.subsidiary, DATE_FORMAT(a.created_at,'%d/%m/%Y %H:%i:%S') as create_at,"+
        "DATE_FORMAT(a.updated_at,'%d/%m/%Y %H:%i:%S') as update_at, DATE_FORMAT(a.deleted_at,'%d/%m/%Y %H:%i:%S') as deleted_at "+
        "FROM appointments a "+
        "LEFT JOIN subsidiaries s ON s.id_subsidiary=a.id_subsidiary "+
        "WHERE a.date_programing = DATE(NOW()) "+
        "AND a.nro_documento = ? AND s.subsidiary = ? AND a.deleted_at IS NULL", [nro_document, subsidiary], async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

const getTicketStatusBySubsidiary = async(req, res) => {
    
    try {
        const { id_subsidiary } = req.params;
        const { date_programing } = req.params;
        const connection = await getConnection();
        await connection.query("SELECT count(ticket_generate) as ticket_status "+
        "FROM appointments "+
        "WHERE id_subsidiary = ? and date_programing = ? and ticket_generate IS NOT NULL", [id_subsidiary, date_programing], async (err, result, fields) => {
            if(err){
                return console.log(err);
            }
            res.json(result);
        });
    }
    catch (error) {
        res.status(500);
        res.send(error.message);
    } 
};

const store = async(req, res) => {
    try {
        const { date_programing, nro_documento, last_name, first_name, company, subcontract, protocol, examen_type, area, job_position, project, cost_center, person_programmed, observation, ticket_time_init, ticket_time_finish, ticket_generate, in_excel_programing, id_subsidiary } = req.body;

        const appointment = { date_programing, nro_documento, last_name, first_name, company, subcontract, protocol, examen_type, area, job_position, project, cost_center, person_programmed, observation, ticket_time_init, ticket_time_finish, ticket_generate, in_excel_programing, id_subsidiary };
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO appointments set ?, created_at=now(), updated_at=now()", appointment);
        res.json({message: "Appointment added", insertId: result.insertId});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const update = async(req, res) => {
    try {
        const { id_appointment } = req.params;
        const { date_programing, nro_documento, last_name, first_name, company, subcontract, protocol, examen_type, area, job_position, project, cost_center, person_programmed, observation, ticket_time_init, ticket_time_finish, ticket_generate, in_excel_programing, id_subsidiary } = req.body;

        const appointment = { date_programing, nro_documento, last_name, first_name, company, subcontract, protocol, examen_type, area, job_position, project, cost_center, person_programmed, observation, ticket_time_init, ticket_time_finish, ticket_generate, in_excel_programing, id_subsidiary };
        const connection = await getConnection();
        const result = await connection.query("UPDATE appointments set ?, updated_at=now() where id_appointment=?", [appointment, id_appointment]);
        res.json({message: "Appointment updated", affectedRows: result.affectedRows, updateId: id_appointment});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const softdelete = async(req, res) => {
    try {
        const { date_programing } = req.params;
        const connection = await getConnection();
        const result = await connection.query("UPDATE appointments "+
        "SET deleted_at = now() "+
        "WHERE in_excel_programing = 1 AND date_programing = ?", date_programing);
        res.json({message: "Appointment deleted", affectedRows: result.affectedRows});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    index,
    getAppointmentAll,
    getAppointmentById,
    getAppointmentByNroDocument,
    getAppointmentAllByNroDocument,
    getAppointmentByNroDocumentAndSubsidiary,
    getTicketStatusBySubsidiary,
    store,
    update,
    softdelete
};