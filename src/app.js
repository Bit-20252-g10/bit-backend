import 'dotenv/config';
import express from "express";
import connectDB from './config/db.js';
import morgan from "morgan";
import inventoryRouter from "./routers/inventory.js";
import userRouter from "./routers/user.js";
import homeRouter from "./routers/home.js";
import imageRouter from "./routers/image.js";
import productsRouter from "./routers/products.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 4000;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://18.234.152.4:') || origin === 'http://my-frontend-jara.s3-website-us-east-1.amazonaws.com/') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

connectDB()

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/images', imageRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: 'El backend está funcionando y CORS está habilitado' });
});

app.use(morgan("dev"));
app.use(express.json());
app.use("/users", userRouter);
app.use("/home", homeRouter);
app.use("/image", imageRouter);
app.use("/inventory", inventoryRouter);
app.use("/products", productsRouter);

app.listen(4000, '0.0.0.0', () => {
  console.log('Servidor corriendo en 0.0.0.0:4000');
});
