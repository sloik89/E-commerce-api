import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound, UnauthenticatedError } from "../errors/index.js";

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
  const { _id } = req.user;
  const { password, oldPassword } = req.body;
  if (!password || !oldPassword) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "password or old password missing" });
  }
  const user = await User.findById(_id);
  if (!user) {
    throw new BadRequest(`User not found with id ${_id}`);
  }
  const isPasswordTheSame = await user.comparePassword(oldPassword);
  if (isPasswordTheSame) {
    throw new UnauthenticatedError(`Password is the same as old`);
  }
  user.password = password;
  await user.save();
  console.log();
  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};
export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
