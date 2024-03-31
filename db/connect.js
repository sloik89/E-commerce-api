import mongoose from "mongoose";

const ConnectDb = async (url) => {
  try {
    const conection = await mongoose.connect(url);
    console.log(`Mongo Db connected ${conection.connection.host}`);
  } catch (err) {
    console.log("error to connect db");
  }
};
export default ConnectDb;
