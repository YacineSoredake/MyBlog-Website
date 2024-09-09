import express, { response } from 'express';
import db from './db/connect.mjs'
import multer  from 'multer';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import  jwt  from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from "bcrypt";


dotenv.config();

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: 'http://127.0.0.1:5500', // The origin you want to allow
  credentials: true, // Enable cookies to be sent and received
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploaded") 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });  
// MVC
import auth from './route/auth.mjs'
import profile from './route/profile.mjs'
import blog from './route/blogs.mjs'

app.use("/blog",blog);
app.use("/profile",profile)
app.use("/auth",auth)


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});