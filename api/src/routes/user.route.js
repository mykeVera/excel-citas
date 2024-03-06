import {Router} from "express";
import { methods as userController } from "./../controllers/users/user.controller";
import { methods as tokenController }  from "./../controllers/security/token.controller";

const router = Router();

router.post("/login", userController.login);
router.post("/auth", userController.authenticated);

router.get("/", tokenController.verifyToken, userController.index);
router.get("/get/:id_user", tokenController.verifyToken, userController.getUserById);
router.post("/store", tokenController.verifyToken, userController.store);
router.put("/update/:id_user", tokenController.verifyToken, userController.update);
router.put("/update/pass/:id_user", tokenController.verifyToken, userController.passwordChange);
router.put("/delete/:id_user", tokenController.verifyToken, userController.softdelete);

export default router;