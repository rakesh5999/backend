import { Router } from "express";
import { registerValidationRules } from "../validator/auth.validator.js";
import { register } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerValidationRules, register);

export default authRouter;

