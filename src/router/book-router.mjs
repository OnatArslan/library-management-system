import express from 'express';
import {
   borrowBook,
   bulkCreateBooks,
   createBook,
   deleteBook,
   getAllBooks,
   getBook, addToLikedBooks, returnBook
} from '../controller/book-controller.mjs';
import {authenticate, restrict} from '../controller/auth-controller.mjs';


const router = express.Router();

router.route(`/`).post(authenticate, restrict(['ADMIN']), createBook).get(getAllBooks)

router.route(`/bulk`).post(authenticate, restrict(['ADMIN']), bulkCreateBooks);

router.route(`/:bookId`).get(getBook).delete(authenticate, restrict(['ADMIN'], deleteBook));

router.route(`/:bookId/borrow`).patch(authenticate, restrict(['USER']), borrowBook);

router.route(`/:bookId/return`).patch(authenticate, restrict(['USER']), returnBook);

router.route(`/:bookId/like`).post(authenticate, restrict(['USER']), addToLikedBooks);


export default router;