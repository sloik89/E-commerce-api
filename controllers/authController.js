import { BadRequest } from "../errors/index.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
const register = async (req, res) => {
  console.log(req.body);
  const { email, name, password } = req.body;
  const role = (await User.countDocuments({})) === 0 ? "admin" : "user";
  const userToken = { name, email, password, role };
  const token = jwt.sign(userToken, "jwtSecret", { expiresIn: "1d" });

  const emailAlreadyExsist = await User.findOne({ email });
  if (emailAlreadyExsist) {
    throw new BadRequest("Email already exsist");
  }
  const user = await User.create({ name, email, password, role, token });

  // console.log(user);
  res.status(StatusCodes.CREATED).json({ user, token });
};
const login = async (req, res) => {
  res.send("login user");
};
const logout = async (req, res) => {
  res.send("logout user");
};
export { register, login, logout };
