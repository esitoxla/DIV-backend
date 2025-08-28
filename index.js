import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/database.js';

import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandling.js';


const PORT = process.env.PORT || 8045

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use(cookieParser());


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    connectDb()
    console.log(`Port ${PORT} ready for use`)
})