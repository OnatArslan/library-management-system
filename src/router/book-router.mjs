import express from "express";
import {bulkCreateBooks, createBook, deleteBook, getAllBooks, getBook} from "../controller/book-controller.mjs";


const router = express.Router();

router.route(`/`).post(createBook).get(getAllBooks)

router.route(`/bulk`).post(bulkCreateBooks);

router.route(`/:bookId`).get(getBook).delete(deleteBook);

export default router;