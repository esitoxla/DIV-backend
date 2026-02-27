import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;


//this file is your Cloudinary configuration setup, which connects your backend to your Cloudinary account so you can upload, delete, and manage images (like QR codes, product photos, etc.).

//This tells your backend how to connect to your specific Cloudinary account.