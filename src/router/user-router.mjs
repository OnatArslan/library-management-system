import express from 'express';
import {createAdmin, getAllUsers} from '../controller/user-controller.mjs';
import {authenticate, restrict} from '../controller/auth-controller.mjs';

const router = express.Router();

router.route(`/`).get(authenticate,restrict(["ADMIN"]),getAllUsers).post(createAdmin)


export default router;