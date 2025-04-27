import express from "express";
import { proxyTranslation } from "../controllers/translationController.js";

export const translationRouter = express.Router();

translationRouter.post("/deepl", proxyTranslation);
