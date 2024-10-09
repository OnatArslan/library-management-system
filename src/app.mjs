import express from 'express';
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import expressSession from "express-session";
import { rateLimit } from "express-rate-limit";


import testRouter from "./routers/testRouter.mjs";

let app = express();


// Using npm package middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use(
    expressSession({
        secret:`${process.env.SESSION_SECRET_KEY}`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    }),
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    message:"Wait for new request!!!",
    
});
app.use(limiter);

app.use(`/test`, testRouter)
export default app;







