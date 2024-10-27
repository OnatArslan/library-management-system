import express from 'express';
import {createAdmin, getAllUsers, getUser} from '../controller/user-controller.mjs';
import {authenticate, restrict} from '../controller/auth-controller.mjs';


const router = express.Router();


router.route(`/`).get(authenticate, restrict(['ADMIN']), getAllUsers).post(authenticate, restrict(['ADMIN']), createAdmin);

router.route('/:userId').get(authenticate,restrict(["ADMIN"]),getUser)

export default router;