import express from "express";
import { register } from "../controllers/authController";

const router = express.Router();

router.route("/register").post(register);

export { router as authRouter };
