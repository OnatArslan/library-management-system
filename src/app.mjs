import express from 'express';
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import expressSession from "express-session";
import {rateLimit} from "express-rate-limit";

// IMPORT ROUTERS
import authRouter from "./router/auth-router.mjs";
import bookRouter from "./router/book-router.mjs";

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

// USING ROUTERS----------------------------------------------------------
app.use(`/auth`,authRouter)
app.use(`/book`,bookRouter)


app.use(`*`,
    (req, res, next) => {
        res.status(404).json({
            status: `fail`,
            message: `Invalid path`
        })
    })

// Error handling middleware

// noinspection JSCheckFunctionSignatures
app.use((err, req, res, next) => {
    
    console.error(err);
    res.status(500).json({
        status: 'error',
        message: err,
    });
});

export default app;







