import express from 'express';
import {createAdmin, getAllUsers} from '../controller/user-controller.mjs';

const router = express.Router();

router.route(`/`).get(getAllUsers).post(createAdmin)


export default router;