import prisma from "../database/prisma.mjs";
import userZod from "../validator/user-zod.mjs";
import bcrypt from "bcrypt";


export const signUp = async(req,res,next) =>{
    try {
        let validData
        let rawData = req.body;
        /* Check data is valid */
        try{
            validData = userZod.parse(rawData);
        }catch(e){
            return next(e)
        }
        delete validData.confirmPassword;
        // Hash password
        const hashedPassword = await bcrypt.hash(validData.password, 10);
        if(!hashedPassword){
            return next(new Error(`Password can not hashed`));
        }
        // Create new user with valid data
        let newUser
        try{
            newUser = await prisma.user.create({
                data:{
                    ...validData,
                    password: hashedPassword,
                },
                omit:{
                    password:true
                }
            })
        }catch(e){
            return next(e)
        }
        
        res.status(200).json({
            status:`success`,
            data:{
                newUser,
                
            }
        })
    }catch(e) {
        next(e)
    }
}


export const getAllUsers = async(req,res,next) =>{
    try {
        const users = await prisma.user.findMany();
        
        res.status(200).json({
            status:`success`,
            data:{
                users
            }
        })
    }catch(e) {
        next(e)
    }
}
