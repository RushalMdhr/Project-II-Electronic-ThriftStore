//packages

import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";

import cors from "cors";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";

//utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

//db connection
dotenv.config();
connectDB();

//app using
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users",userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// __________________IMAGE________________________________________
app.use("/api/upload", uploadRoutes);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
// __________________IMAGE________________________________________



//host port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running in ${port}`));

