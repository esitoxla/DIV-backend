import express, { urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database.js';
import { authRoutes } from './routes/authRoutes.js'

const app = express();

const PORT=process.env.PORT || 8000;
// app.use(cors());
// app.use(helmet())
// app.use(cookieParser())
app.use(express.json());
app.use(express, urlencoded({extended:true}))


app.use('/api/auth', authRoutes)


app.listen(PORT, ()=>{
    console.log(`Serving is running on PORT ${PORT}`);
    connectDB();
})