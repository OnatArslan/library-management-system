import express from 'express';
import testRouter from "./routers/testRouter.mjs";

let app = express();

app.use(`/test`, testRouter)
export default app;







