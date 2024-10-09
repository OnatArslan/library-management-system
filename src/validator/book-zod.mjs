import {z} from "zod";
import isISBN from "validator/es/lib/isISBN.js";


const bookZod = z.object({
    id: z.string().cuid().optional(),
    isbn: z.string().refine((val) => isISBN(val), {
        message: `Invalid ISBN format`
    }),
    title: z.string().min(2, `Book title must have at least 2 characters`),
    authors: z.array(z.string()),
    category: z.string(),
    isBooked: z.boolean().default(false),
    publishedAt: z.date().optional(),
    
    
    
});

export default bookZod;