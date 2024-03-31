import dotenv from "dotenv";
import express from "express";
dotenv.config();
import "express-async-errors";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error-handler.js";
// database
import connectDb from "./db/connect.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  throw new Error("ssss");
  res.send("e commerce");
});
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
