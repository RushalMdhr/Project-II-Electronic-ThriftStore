//packages
import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

//app using
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/users",userRoutes);
app.use("/api", productRoutes);

//host port

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running in ${port}`));

