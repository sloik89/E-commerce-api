import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound, UnauthenticatedError } from "../errors/index.js";
import checkPermissions from "../utilis/checkPermission.js";
import { attachCokkieToResponse } from "../utilis/jswt.js";
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
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json(user);
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequest(`Please provide all values`);
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { email, name },
    { new: true, runValidators: true }
  );
  const userToken = {
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    _id: user._id,
  };
  attachCokkieToResponse(res, userToken);
  res.status(StatusCodes.OK).json({ user: userToken });
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

  res.status(StatusCodes.OK).json({ msg: "Password Updated" });
};
export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
