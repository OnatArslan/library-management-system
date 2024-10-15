import express from "express";
import {authenticate, logOut, signIn, signUp} from "../controller/auth-controller.mjs";


const router = express.Router();

router.route(`/sign-up`).post(signUp)
router.route(`/sign-in`).post(signIn)
router.route(`/log-out`).delete(logOut)


export default router;

