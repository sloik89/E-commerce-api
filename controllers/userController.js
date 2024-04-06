import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../errors/index.js";

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  if (!users) {
    throw new BadRequest("There is no users");
  }
  res.status(StatusCodes.OK).json(users);
};
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new NotFound("User not found");
  }
  res.status(StatusCodes.OK).json(user);
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};
const updateUser = async (req, res) => {
  res.send("update user");
};
const updateUserPassword = async (req, res) => {
  res.send("updata password");
};
export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
