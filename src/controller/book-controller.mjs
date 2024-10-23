import bookZod from '../validator/book-zod.mjs';
import prisma from '../database/prisma.mjs';
import AppError from '../utils/AppError.mjs';
import {StatusCodes} from 'http-status-codes';


export const createBook = async (req, res, next) => {
   try {
      //     Test if data is valid
      let validData;
      let newBook;
      try {
         validData = bookZod.parse({
            ...req.body,
            publishedAt: new Date(req.body.publishedAt)
         });
      } catch (e) {
         return next(e)
      }
      try {
         newBook = await prisma.book.create({
            data: {
               ...validData
            },
            omit: {
               currentOwnerId: true,
               createdAt: true
            }
         })
      } catch (e) {
         return next(e.stack)
      }
      res.status(200).json({
         status: `success`,
         data: {
            book: newBook
            
         }
      })
   } catch (e) {
      next(e)
   }
}

export const bulkCreateBooks = async (req, res, next) => {
   try {
      let validBooksData = [];
      let books = [];
      req.body.forEach(bookData => {
         bookData.publishedAt = new Date(bookData.publishedAt);
      })
      
      req.body.forEach(datedBookData => {
         try {
            let validBookData = bookZod.parse({
               ...datedBookData
            });
            validBooksData.push(validBookData);
         } catch (e) {
            return next(e)
         }
      })
      
      try {
         books = await prisma.book.createManyAndReturn({
            data: validBooksData
         })
      } catch (e) {
         return next(e);
      }
      res.status(200).json({
         status: `success`,
         data: {
            books
         }
      })
      
   } catch (e) {
      next(e)
   }
}

export const getAllBooks = async (req, res, next) => {
   try {
      const books = await prisma.book.findMany({
         where: {
            isBooked: false,
            currentOwnerId: null
         },
         omit: {
            currentOwnerId: true
         }
      });
      res.status(200).json({
         status: `success`,
         data: {
            books
         }
      })
   } catch (e) {
      next(e)
   }
}

export const getBook = async (req, res, next) => {
   try {
      const bookId = req.params.bookId;
      
      const book = await prisma.book.findUnique({
         where: {
            id: bookId
         },
         omit: {
            currentOwnerId: true
         }
      });
      res.status(200).json({
         status: `success`,
         data: {
            book
         }
      })
   } catch (e) {
      next(e)
   }
}

export const deleteBook = async (req, res, next) => {
   try {
      const bookId = req.params.bookId;
      try {
         await prisma.book.delete({
            where: {
               id: bookId,
               isBooked: false
            }
         })
      } catch (e) {
         return next(e)
      }
      res.status(200).json({
         status: `success`,
         message: `Book deleted...`
      })
   } catch (e) {
      next(e)
   }
}

export const borrowBook = async (req, res, next) => {
   try {
      const bookId = req.params.bookId;
      // Try to find and update a book with given ID
      let book;
      try {
         book = await prisma.book.update({
            where: {
               id: bookId,
               isBooked: false
            },
            data:{
               isBooked: true,
               currentOwnerId: req.user.id,
               
            }
         })
      }catch (e) {
         return next(e);
      }
      
      
      
      res.status(StatusCodes.OK).json({
         status:`success`,
         message:""
      })
   } catch (e) {
      next(e)
   }
}

export const addToLikedBooks = async (req, res, next) => {
   try {
   
   } catch (e) {
      next(e);
   }
}


export const returnBook = async (req, res, next) => {
   try {
   
   } catch (e) {
      next(e);
   }
}