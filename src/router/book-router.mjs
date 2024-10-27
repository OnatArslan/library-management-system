import express from 'express';
import {
   borrowBook,
   bulkCreateBooks,
   createBook,
   deleteBook,
   getAllBooks,
   getBook, addToLikedBooks, returnBook, removeFromLikedBooks, getBorrowedBooks
} from '../controller/book-controller.mjs';
import {authenticate, restrict} from '../controller/auth-controller.mjs';


const router = express.Router();

router.route(`/`).post(authenticate, restrict(['ADMIN']), createBook).get(getAllBooks)

router.route(`/bulk`).post(authenticate, restrict(['ADMIN']), bulkCreateBooks);

router.route(`/:bookId`).get(getBook).delete(authenticate, restrict(['ADMIN'], deleteBook));

router.route(`/:bookId/borrow`).patch(authenticate, restrict(['USER']), borrowBook);

router.route(`/:bookId/return`).patch(authenticate, restrict(['USER']), returnBook);

router.route(`/:bookId/liked`).post(authenticate, restrict(['USER']), addToLikedBooks);

router.route(`/:bookId/liked`).delete(authenticate, restrict(['USER']), removeFromLikedBooks);

router.route(`/borrowed`).get(authenticate, restrict([`USER`]),getBorrowedBooks)

export default router;