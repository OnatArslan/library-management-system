import bookZod from "../validator/book-zod.mjs";


export const createBook = async(req,res,next) =>{
    try {
        //     Test if data is valid
        let validData;
        let newBook;
        try {
            validData = bookZod.parse(req.body);
        } catch(e) {
            return next(e)
        }
        try{
             newBook = await prisma.book.create({
                data:{
                    ...validData
                }
            })
        }catch(e){
            return next(e)
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