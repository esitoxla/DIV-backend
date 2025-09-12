import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/database.js';
import authRoute from "./routes/authRoute.js"
import path from 'path'
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandling.js';


const PORT = process.env.PORT || 8045

const app = express();
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'uploads')));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoute);




app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    connectDb()
    console.log(`Port ${PORT} ready for use`)
})