import bookZod from "../validator/book-zod.mjs";
import prisma from "../database/prisma.mjs";



export const createBook = async(req,res,next) =>{
    try {
        //     Test if data is valid
        let validData;
        let newBook;
        try {
            validData = bookZod.parse({
                ...req.body,
                publishedAt:new Date(req.body.publishedAt)
            });
        } catch(e) {
            return next(e)
        }
        try{
             newBook = await prisma.book.create({
                data:{
                    ...validData
                },
                 omit:{
                     currentOwnerId: true,
                     createdAt: true,
                     
                 }
            })
        }catch(e){
            return next(e.stack)
        }
        res.status(200).json({
            status:`success`,
            data:{
                book: newBook,
                
            }
        })
    }catch(e) {
        next(e)
    }
}

export const bulkCreateBooks = async(req,res,next)=>{
    try {
    
    } catch(e){
        next(e)
    }
}

export const getAllBooks = async(req,res,next) =>{
    try{
        const books = await prisma.book.findMany({
            where:{
                isBooked:false,
                currentOwnerId:null
            },
            omit:{
                currentOwnerId:true
            }
        });
        res.status(200).json({
            status:`success`,
            data:{
                books
            }
        })
    }catch(e) {
        next(e)
    }
}

export const getBook = async(req,res,next) =>{
    try{
        const bookId = req.params.bookId;
        
        const book = await prisma.book.findUnique({
            where:{
                id:bookId
            },
            omit:{
                currentOwnerId:true
            }
        });
        res.status(200).json({
            status:`success`,
            data:{
                book
            }
        })
    }catch(e) {
        next(e)
    }
}

