import prisma from "../database/prisma.mjs";
import {userEmailZodSchema, userLoginZodSchema, userRegisterZodSchema, userZodSchema} from '../validator/user-zod.mjs';
import jwt from "jsonwebtoken"
import {hashPassword} from "../utils/hashPassword.mjs";
import bcrypt from "bcrypt";
import {signJwt} from "../utils/sendJwt.mjs";
import AppError from '../utils/AppError.mjs';
import  crypto from 'node:crypto';
import transport from '../utils/mailer.mjs';

import {
  StatusCodes
} from 'http-status-codes';




export const signUp = async(req,res,next) =>{
    try {
        let validData
        let {email,username, password, confirmPassword} = req.body;
        /* Check data is valid */
        try{
            validData = userRegisterZodSchema.parse({
              email:email,
              username: username,
              password: password,
              confirmPassword: confirmPassword,
            });
        }catch(e){
            return next(e)
        }
        // Deleting confirm password field because prisma user schema does not have
        delete validData.confirmPassword;
        
        // Hash password
        let hashedPassword
        try{
        hashedPassword = await hashPassword(validData.password, 10)
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
                    role:"USER"
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
          token = signJwt(newUser.id);
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
      let validData;
      try{
        validData = userLoginZodSchema.parse({
          email,
          password
        })
      }catch(e) {
        return next(e)
      }
      // 2) Find user in database
      const user = await prisma.user.findUnique({
        where:{
          email:validData.email
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
      token = signJwt(user.id)
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
      })
    }catch(e) {
        next(e)
    }
}

export const authenticate = async(req,res,next) =>{
  try {
// 1. Extract the token from the request cookies.
    const token = req.cookies.token
    if(!token) return next(new AppError(`Token is missing!!`, StatusCodes.UNAUTHORIZED));
    
    // 2. Verify the JWT token.
    let decoded
    try{
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    }catch(e) {
      return next(new AppError(`Token is invalid or has expired`, StatusCodes.UNAUTHORIZED));
    }
    
    // 3. Find user with given decoded id
    const user = await prisma.user.findUnique({
      where:{
        id: decoded.id,
        
      }
    })
    if(!user){
      return next(new AppError(`A user belongs to this token has deleted...`, StatusCodes.UNAUTHORIZED))
    }
    // Check if user has password changed at field
    if(user.passwordChangedAt){
      // Check if password changed after token is created +10000 for when register times will be the same
      if (user.passwordChangedAt.getTime() > decoded.iat * 1000 + 10000) {
        return next(new AppError(`Password changed after token creation. Please login again!`,StatusCodes.UNAUTHORIZED));
      }
    }
    
    // If all is done, call next middleware for accessing routes
    req.user = user;
    next();
  }catch(e) {
    next(e)
  }
}

export const restrict = (roles) =>{
  return async(req,res,next) =>{
    try{
      if(!roles.includes(req.user.role)){
        return next(new AppError("Only admins can access this route",StatusCodes.UNAUTHORIZED))
      }
      next()
    }catch (e) {
      next(e)
    }
  }
}

export const logOut = async(req,res,next) =>{
  try {
    if(req.cookies.token){
      // Clear token with clearCookie function
      res.clearCookie("token")
      res.status(200).json({
        status:`success`,
        message:`Logged out successfully`,
      })
    }else{
      return next(new Error(`Already logged out!`))
    }
  }catch(e) {
    next(e)
  }
}

export const forgotPassword = async(req,res,next) =>{
  try {
    // 1) Get email from request body
    const {email} = req.body;
    
    // 2) Check given email is valid
    let validData;
    try {
      validData = userEmailZodSchema.parse({
        email
      });
    } catch (e) {
      return next(e);
    }
    
    //  3) Find user with given email
    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      omit: {
        password: true
      }
    })
    // If user is not found return an error
    if (!user) {
      return next(new AppError('Can not find any user with given email!', StatusCodes.NOT_FOUND))
    }
    
    // 4) Create a reset token
    const resetString = crypto.randomBytes(32).toString('hex');
    
    // 5) Hash the reset token
    const hashedResetString = crypto.createHash('sha256').update(resetString).digest('hex');
    
    
    
    // 6) Save the hashed reset token and set expiration time
    try {
      await prisma.user.update({
        where: {email: email},
        data: {
          passwordResetString: hashedResetString,
          passwordResetExpiresIn: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
        }
      });
    } catch (e){
      return next(e);
    }
    

    // 7) Send the reset token to the user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetString}`;


    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await transport.sendMail({
        from: 'no-reply@example.com',
        to: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        text: message
      });
      
      res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Token sent to email!'
      });
      
    } catch (e) {
      try{
        await prisma.user.update({
          where: { email: email },
          data: {
            passwordResetString: null,
            passwordResetExpiresIn: null
          }
        });
      }catch (e){
        return next(e);
      }
      return next(e);
    }
  }catch (e) {
    next(e)
  }
}
