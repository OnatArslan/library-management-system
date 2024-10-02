import express from "express";
import {getTest} from "../controllers/testController.mjs";
const router = express.Router();

router.route(`/`).get(getTest)


export default router