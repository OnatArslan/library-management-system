import {z} from "zod";

const userZodSchema = z.object({
    email: z.string().email({
        message: "Invalid email format. Please enter a valid email."
    }),
    username: z.string().min(4, {
        message: "Username is required and cannot be empty."
    }),
    bio: z.string().optional(), // No message since it's optional
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long."
    }),
    confirmPassword: z.string({
        message: "Confirm password is required."
    }),
    role:z.enum(["ADMIN","USER"]).default("USER")
     // Optional but should still be a valid date if provided
}).refine((user) =>{
    return user.password === user.confirmPassword;
},{
    message:"Password do not match",
    path:["confirmPassword"]
});

export default userZodSchema;