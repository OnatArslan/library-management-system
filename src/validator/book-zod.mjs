import {z} from "zod";



const bookZod = z.object({
    id: z.string().cuid().optional(),
    isbn: z.string(),
    title: z.string().min(2, `Book title must have at least 2 characters`),
    authors: z.array(z.string()),
    category: z.enum([
        "FICTION", "LITERARY_FICTION", "HISTORICAL_FICTION", "MYSTERY", "THRILLER",
        "SCIENCE_FICTION", "FANTASY", "HORROR", "ROMANCE", "ADVENTURE", "NON_FICTION",
        "BIOGRAPHY", "SELF_HELP", "HISTORY", "TRAVEL", "COOKBOOK", "HEALTH_WELLNESS",
        "BUSINESS", "SCIENCE", "YOUNG_ADULT", "CHILDRENS", "GRAPHIC_NOVEL", "POETRY",
        "CLASSIC_LITERATURE", "OTHER"
    ]),
    isBooked: z.boolean().default(false),
    publishedAt: z.date().optional(),
    totalScore: z.instanceof(Decimal).default(new Decimal(0)),
    createdAt: z.date().default(new Date()),
    currentOwnerId: z.string().cuid().optional(),
    likedByUsers: z.array(z.string()).optional(),
    oldBookedBy: z.array(z.string()).optional(),
    reviews: z.array(z.string()).optional()
});





export default bookZod;