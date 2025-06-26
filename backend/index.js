//packages

import dotenv from "dotenv";

import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cookieParser from "cookie-parser";

//utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartitemRoutes from "./routes/cartitemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

//db connection
connectDB();

//app using
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users",userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);


app.use("/api/cart", cartitemRoutes);
app.use("/api/orders", orderRoutes);

// __________________IMAGE________________________________________
app.use("/api/upload", uploadRoutes);
app.use("/uploadimage", express.static(path.join(__dirname + "/uploadimage")));
// __________________IMAGE________________________________________



//host port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running in ${port}`));

