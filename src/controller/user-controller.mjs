import prisma from '../database/prisma.mjs';
import AppError from '../utils/AppError.mjs';
import {StatusCodes} from 'http-status-codes';
import {userRegisterZodSchema} from '../validator/user-zod.mjs';
import {hashPassword} from '../utils/hashPassword.mjs';



export const getAllUsers = async (req,res,next) =>{
  try{
    const users = await prisma.user.findMany({
      omit:{
        password:true,
        passwordChangedAt:false,
      }
    });
    
    res.status(StatusCodes.OK).json({
      status:`success`,
      users
    })
  }catch (e) {
    next(e)
  }
}

export const createAdmin = async(req,res,next) =>{
  try {
    const {username, email, password, confirmPassword} = req.body;
    let validData;
    // Check data is valid
    try {
      validData = userRegisterZodSchema.parse({
        username,
        email,
        password,
        confirmPassword,
      });
    } catch (e){
      return next(e);
    }
    delete validData.confirmPassword;
    // If data is valid, create an admin with given data
    let hashedPassword
    try{
      hashedPassword = await hashPassword(validData.password, 10)
    }catch (e) {
      return next(e);
    }
    
    let newAdmin;
    try{
      newAdmin = await prisma.user.create({
        data:{
          ...validData,
          password:hashedPassword,
          role:'ADMIN'
        }
      })
    }catch (e) {
      return next(e)
    }
    
    res.status(StatusCodes.CREATED).json({
      status:`success`,
      data:{
        admin:newAdmin
      }
    })
    
  }catch (e) {
    next(e)
  }
}

export const getUser = async (req,res,next) =>{
  try{
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userId
      },
      omit:{
        password:true,
        passwordChangedAt:true
      }
    });
    if(!user){
      return next(new AppError("Can not find any user with given ID",StatusCodes.NOT_FOUND))
    }
    res.status(StatusCodes.OK).json({
      status:`success`,
      user
    })
  }catch (e) {
    next(e)
  }
}

