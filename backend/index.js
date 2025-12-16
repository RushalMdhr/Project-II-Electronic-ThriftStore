//packages
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

//utils
import connectDB from "./config/db.js";

import testRoutes from "./routes/testRoutes.js"
import esewaRoutes from "./routes/esewaRoutes.js"
import userRoutes from "./routes/userRoutes.js"

import cors from "cors";
//app using
const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors())
app.use(cors({
  origin: 'http://localhost:5173', // allow frontend access
//   credentials: true               // if you're using cookies or sessions
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mulitsector
app.use("/test",testRoutes);
app.use("/esewa",esewaRoutes);
app.use("/user",userRoutes);

//host port
dotenv.config();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running in ${port}`));

connectDB();