import {z} from "zod";

const userZodSchema = z.object({
    email: z.string().email({
        message: "Invalid email format. Please enter a valid email."
    }),
    username: z.string().min(1, {
        message: "Username is required and cannot be empty."
    }),
    bio: z.string().optional(), // No message since it's optional
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long."
    }),
    passwordChangedAt: z.date().optional().refine((val) => val instanceof Date, {
        message: "Password changed date must be a valid DateTime."
    }), // Optional but should still be a valid date if provided
});

export default userZodSchema;