import {z} from "zod";

export const userZodSchema = z.object({
    email: z.string().email({
        message: "Invalid email format. Please enter a valid email."
    }),
    username: z.string().min(4, {
        message: "Username is required and must be at least 4 characters long.",
    }),
    bio: z.string().optional(), // No message since it's optional
    password: z.string().min(8, {
        message: "Password is required and must be at least 8 characters long."
    }),
    confirmPassword: z.string({
        message: "Confirm password is required."
    }),
    createdDate:z.date().optional(),
    role:z.enum(["ADMIN","USER"]).default("USER")
     // Optional but should still be a valid date if provided
}).refine((user) =>{
    return user.password === user.confirmPassword;
},{
    message:"Password do not match",
    path:["confirmPassword"]
});


export const userRegisterZodSchema = z.object({
  email: z.string().email({
    message: "Invalid email format. Please enter a valid email."
  }),
  username: z.string().min(4, {
    message: "Username is required and must be at least 4 characters long.",
  }),
  password: z.string().min(8, {
    message: "Password is required and must be at least 8 characters long."
  }),
  confirmPassword: z.string({
    message: "Confirm password is required."
  }),
}).refine((user) =>{
  return user.password === user.confirmPassword;
},{
  message:"Password do not match",
  path:["confirmPassword"]
})

export const userLoginZodSchema = z.object({
  email:z.string().email({
    message:"Invalid email format. Please enter a valid email"
  }),
  password:z.string().min(8,{
    message:"Password is required and must be at least 8 characters long."
  })
})


export const userEmailZodSchema = z.object({
  email:z.string().email({
    message:"Invalid email format.Please enter a valid email!"
  })
})

export const userChangePasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password is required and must be at least 8 characters long."
  }),
  confirmPassword: z.string({
    message: "Confirm password is required."
  }),
}).refine(user =>{
  return user.password === user.confirmPassword
},{
  message:"Password do not match",
  path:["confirmPassword"]
})