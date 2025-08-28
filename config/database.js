import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

export function connectDb() {
  mongoose
    .connect(uri)
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
}

