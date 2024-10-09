import {z} from "zod";



const bookZod = z.object({
    id: z.string().cuid().optional(),
    isbn: z.string(),
    title: z.string().min(2, `Book title must have at least 2 characters`),
    authors: z.array(z.string()),
    category: z.string(),
    isBooked: z.boolean().default(false),
    publishedAt: z.date().optional(),
    
    
    
});

export default bookZod;