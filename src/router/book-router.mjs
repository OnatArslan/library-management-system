import express from "express";
import {createBook, getAllBooks, getBook} from "../controller/book-controller.mjs";


const router = express.Router();

router.route(`/`).post(createBook).get(getAllBooks)

router.route(`/:bookId`).get(getBook);

export default router;