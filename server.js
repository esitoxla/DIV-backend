import express from 'express'

const app = express();

const PORT=process.env.PORT || 8000;

app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Serving is running on PORT ${PORT}`);
})