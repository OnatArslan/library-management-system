import prisma from "../database/prisma.mjs";
import {userZodSchema} from "../validator/user-zod.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const signUp = async(req,res,next) =>{
    try {
        let validData
        let {email, password, confirmPassword,username} = req.body;
        /* Check data is valid */
        try{
            validData = userZodSchema.parse({
              email:email,
              username: username,
              password: password,
              confirmPassword: confirmPassword,
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
      if(!user) return next(new Error(`Invalid credentials`));
      
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


export const authenticate = async(req,res,next) =>{
  try {
// 1. Extract the token from the request cookies.
    const token = req.cookies.token
    if(!token) return next(new Error(`Token is missing!!`))
    
    // 2. Verify the JWT token.
    let decoded
    try{
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    }catch(e) {
      return next(new Error(`Token is invalid or has expired`));
    }
    
    // 3. Find user with given decoded id
    const user = await prisma.user.findUnique({
      where:{
        id: decoded.id,
        
      }
    })
    if(!user){
      return next(new Error(`A user belongs to this token has deleted...`))
    }
    // Check if user has password changed at field
    if(user.passwordChangedAt){
      // Check if password changed after token is created +10000 for when register times will be the same
      if (user.passwordChangedAt.getTime() > decoded.iat * 1000 + 10000) {
        return next(new Error(`Password changed after token creation. Please login again!`));
      }
    }
    
    // If all is done, call next middleware for accessing routes
    req.user = user;
    next();
  }catch(e) {
    next(e)
  }
}


export const getAllUsers = async(req,res,next) =>{
    try {
      const users = await prisma.user.findMany();
      console.log(req.user);
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
