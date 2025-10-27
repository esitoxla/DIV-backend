import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/database.js';
import authRoute from "./routes/authRoute.js"
import folderRoute from "./routes/folderRoute.js"
import qrRoute from "./routes/qrCodeRoute.js"
import path from 'path'
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandling.js';


const PORT = process.env.PORT || 8045

const app = express();


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/upload", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/folders", folderRoute);
app.use("/api/qrCodes", qrRoute);




app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    connectDb()
    console.log(`Port ${PORT} ready for use`)
})