import prisma from "../database/prisma.mjs";
import userZod from "../validator/user-zod.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const signUp = async(req,res,next) =>{
    try {
        let validData
        let rawData = req.body;
        /* Check data is valid */
        try{
            validData = userZod.parse({
              ...rawData,
              role:"USER"
            });
        }catch(e){
            return next(e)
        }
        delete validData.confirmPassword;
        // Hash password
        let hashedPassword
        try{
        hashedPassword = await bcrypt.hash(validData.password, 10);
        }catch(e) {
            return next(e)
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
        // Create jwt token
        let token;
        try {
        token = jwt.sign({id:newUser.id}, process.env.JWT_SECRET_KEY,{
            expiresIn: "2 days",
        })
        }catch(e) {
            return next(e)
        }
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
        });
        
        res.status(200).json({
            status:`success`,
            message:`${newUser.username} created and logged in successfully`
        })
    }catch(e) {
        next(e)
    }
}


export const signIn = async(req,res,next) =>{
    try {
      // 1) Get user credentials
      const {email, password} = req.body;
      if(!email || !password) {return next(new Error(`Missing credentials`))}
      
      // 2) Find user in database
      const user = await prisma.user.findUnique({
        where:{
          email:email
        }
      })
      // If user didn't found return error
      if(!user) return next(new Error(`Invalid email`));
      
      // 3) Compare password
      const match = await bcrypt.compare(password,user.password)
      
      if(!match){
        return next(new Error(`Invalid credentials`))
      }
      let token;
      try{
      token = jwt.sign({id:user.id},process.env.JWT_SECRET_KEY,{
        expiresIn: "2 days"
      } )
      }catch(e) {
        return next(e)
      }
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
      });
      res.status(200).json({
        status: `success`,
        message: `${user.username} logged in successfully`,
        token: token,
        
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
