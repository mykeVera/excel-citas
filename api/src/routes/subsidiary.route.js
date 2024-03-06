import {Router} from "express";
import { methods as subsidiaryController } from "./../controllers/subsidiaries/subsidiary.controller";
import { methods as tokenController }  from "./../controllers/security/token.controller";

const router = Router();

router.get("/", tokenController.verifyToken, subsidiaryController.index);
router.get("/get/:subsidiary", tokenController.verifyToken, subsidiaryController.getSubsidiaryByDescription);

export default router;