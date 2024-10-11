import express from "express";
import {getAllUsers, signIn, signUp} from "../controller/auth-controller.mjs";


const router = express.Router();

router.route(`/sign-up`).post(signUp)
router.route(`/sign-in`).post(signIn)

router.route(`/`).get(getAllUsers)

export default router;