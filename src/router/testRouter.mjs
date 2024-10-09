import express from "express";
import {getTest} from "../controller/testController.mjs";
const router = express.Router();

router.route(`/`).get(getTest)


export default router