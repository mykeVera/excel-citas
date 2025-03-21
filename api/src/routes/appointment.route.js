import {Router} from "express";
import { methods as appointmentController } from "../controllers/appointment/appointment.controller";
import { methods as tokenController }  from "./../controllers/security/token.controller";

const router = Router();

router.get("/", tokenController.verifyToken, appointmentController.index);
router.post("/store", tokenController.verifyToken, appointmentController.store);
router.get("/get/range/:date1/:date2", tokenController.verifyToken, appointmentController.getAppointmentAll);
router.get("/get/id/:id_appointment", tokenController.verifyToken, appointmentController.getAppointmentById);
router.get("/get/nro/:nro_document", tokenController.verifyToken, appointmentController.getAppointmentByNroDocument);
router.get("/get/nro/all/:nro_document", tokenController.verifyToken, appointmentController.getAppointmentAllByNroDocument);
router.get("/get/nro_sub/:nro_document/:subsidiary", tokenController.verifyToken, appointmentController.getAppointmentByNroDocumentAndSubsidiary);
router.get("/get/status_ticket/:id_subsidiary/:date_programing", tokenController.verifyToken, appointmentController.getTicketStatusBySubsidiary);
router.put("/update/:id_appointment", tokenController.verifyToken, appointmentController.update);
router.put("/delete/:date_programing", appointmentController.softdelete);

export default router;