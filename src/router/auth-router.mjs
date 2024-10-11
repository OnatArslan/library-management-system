import express from "express";
import {signUp} from "../controller/auth-controller.mjs";


const router = express.Router();

router.route(`/sign-up`).post(signUp)

export default router;