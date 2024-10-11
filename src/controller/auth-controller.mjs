import prisma from "../database/prisma.mjs";

export const signUp = async(req,res,next) =>{
    try {
        
        
        
        res.status(200).json({
            status:`success`,
            data:{
            
            }
        })
    }catch(e) {
        next(e)
    }
}