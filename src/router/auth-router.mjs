import express from "express";
import {getAllUsers, signUp} from "../controller/auth-controller.mjs";


const router = express.Router();

router.route(`/sign-up`).post(signUp)

router.route(`/`).get(getAllUsers)

export default router;