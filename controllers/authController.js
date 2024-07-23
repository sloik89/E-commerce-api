import { BadRequest, UnauthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import {
  attachCokkieToResponse,
  configureBearerToken,
  createJWT,
} from "../utilis/jswt.js";
import User from "../models/User.js";
const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExsist = await User.findOne({ email });
  if (emailAlreadyExsist) {
    throw new BadRequest("Email already exsist");
  }
  const role = (await User.countDocuments({})) === 0 ? "admin" : "user";
  const user = await User.create({ name, email, password, role });
  const userToken = {
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    _id: user._id,
  };
  attachCokkieToResponse(res, userToken);

  res.status(StatusCodes.CREATED).json({ user: userToken });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide email or password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequest("User not found");
  }
  const pswdIsMatch = await user.comparePassword(password);
  if (!pswdIsMatch) {
    throw new UnauthenticatedError("Wrong password");
  }

  const userToken = {
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
    _id: user._id,
  };
  const token = createJWT(userToken);
  console.log(token);

  // attachCokkieToResponse(res, userToken);
  res
    .status(StatusCodes.OK)
    .json({ msg: "login succesfull", user: { username: user.name, token } });
};
const logout = async (req, res) => {
  const verify = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  console.log(verify);
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logout" });
};
export { register, login, logout };
