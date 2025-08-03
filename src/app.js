import 'dotenv/config';
import express from "express";
import connectDB from './config/db.js';
import morgan from "morgan";
import gamesRouter from "./routers/games.js";
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

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/images', imageRouter); 

app.get("/", (req, res) => {
    res.status(204).send();
});

connectDB()

// middlewares
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use("/games", gamesRouter);
app.use("/users", userRouter);
app.use("/home", homeRouter);
app.use("/image", imageRouter);
app.use("/products", productsRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://${host}:${port}`);
  console.log("Available routes:");
  console.log("  GET  /products - All products");
  console.log("  GET  /products/games - All games");
  console.log("  GET  /products/consoles - All consoles");
  console.log("  GET  /products/accessories - All accessories");
});

