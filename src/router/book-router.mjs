import express from "express";
import {createBook} from "../controller/book-controller.mjs";


const router = express.Router();

router.route(`/`).post(createBook)

export default router;