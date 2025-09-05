import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import cookieParser from 'cookie-parser';
import authRoute from "./routes/authRoutes.js"
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = process.env.PORT || 8000;

const app =express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser());
app.use("/api/auth", authRoute)

app.use(errorHandler)

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listening on port ${PORT}`);
})


// mongodb+srv://eunicemaabenayayra_db_user:CwAH9CjWtr18swpT@cluster0.wen9gqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0