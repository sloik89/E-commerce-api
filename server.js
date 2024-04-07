import dotenv from "dotenv";
import express from "express";
dotenv.config();
import "express-async-errors";
// middleware
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error-handler.js";
// database
import connectDb from "./db/connect.js";
// routers
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
const app = express();
// rest of packages
import cookieParser from "cookie-parser";
import morgan from "morgan";
import fileUpload from "express-fileupload";
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static("./public"));
app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("e commerce");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use(notFound);
app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`server works on ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
startServer();
