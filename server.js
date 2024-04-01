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
const app = express();
// rest of packages
import morgan from "morgan";
app.use(express.json());
app.use(morgan("tiny"));
app.get("/", (req, res) => {
  res.send("e commerce");
});
app.use("/api/auth", authRoutes);
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
