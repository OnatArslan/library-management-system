import express from "express";
import {bulkCreateBooks, createBook, deleteBook, getAllBooks, getBook} from "../controller/book-controller.mjs";
import {authenticate, restrict} from '../controller/auth-controller.mjs';


const router = express.Router();

router.route(`/`).post(authenticate, restrict(["ADMIN"]), createBook).get(getAllBooks)

router.route(`/bulk`).post(authenticate, restrict(["ADMIN"]),bulkCreateBooks);

router.route(`/:bookId`).get(getBook).delete(authenticate, restrict(["ADMIN"],deleteBook));

export default router;