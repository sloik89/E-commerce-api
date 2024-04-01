import { BadRequest } from "../errors/index.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { attachCokkieToResponse } from "../utilis/jswt.js";
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
  };
  attachCokkieToResponse(res, userToken);

  res.status(StatusCodes.CREATED).json({ user: userToken });
};
const login = async (req, res) => {
  console.log(req.cookies);
  res.send("login user");
};
const logout = async (req, res) => {
  res.send("logout user");
};
export { register, login, logout };
