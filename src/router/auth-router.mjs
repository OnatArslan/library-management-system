import express from "express";
import {forgotPassword, logOut, resetPassword, signIn, signUp} from '../controller/auth-controller.mjs';



const router = express.Router();

router.route(`/sign-up`).post(signUp)
router.route(`/sign-in`).post(signIn)
router.route(`/log-out`).delete(logOut)

router.route(`/forgot-password`).post(forgotPassword)
router.route(`/reset-password/:resetString`).patch(resetPassword)
export default router;
