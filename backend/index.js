//packages

import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import cors from "cors";
import cron from "node-cron";

import cookieParser from "cookie-parser";

//utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartitemRoutes from "./routes/cartitemRoutes.js";
import esewaRoutes from "./routes/esewaRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { deleteErrorOrder } from "./controllers/orderController.js";

//db connection
connectDB();

//app using
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true, // Allow cookies to be sent if needed
  })
);

// _______________________________________________ Cleanup job _______________________________________________
cron.schedule('*/1 * * * *', deleteErrorOrder); // Every 2 minutes
// cron.schedule('0 * * * *', deleteErrorOrder);    // Every hour
// cron.schedule('0 2 * * *', deleteErrorOrder);    // Daily at 2 AM

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartitemRoutes);
app.use("/api/esewa", esewaRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/reviews", reviewRoutes);

// __________________IMAGE________________________________________
app.use("/api/upload", uploadRoutes);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
// __________________IMAGE________________________________________

//host port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running in ${port}`));
