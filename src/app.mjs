import express from 'express';
import testRouter from "./routers/testRouter.mjs";

const app = express();


app.use(`/test`, testRouter)
export default app;

