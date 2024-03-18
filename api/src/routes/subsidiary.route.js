import {Router} from "express";
import { methods as subsidiaryController } from "./../controllers/subsidiaries/subsidiary.controller";
import { methods as tokenController }  from "./../controllers/security/token.controller";

const router = Router();

router.get("/", tokenController.verifyToken, subsidiaryController.index);
router.put("/update/:id_subsidiary", tokenController.verifyToken, subsidiaryController.update);
router.get("/get_by_id/:id_subsidiary", tokenController.verifyToken, subsidiaryController.getSubsidiaryById);
router.get("/get/:subsidiary", tokenController.verifyToken, subsidiaryController.getSubsidiaryByDescription);

export default router;