import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { BadRequest, UnauthenticatedError } from "../errors/index.js";
const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};
const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCokkieToResponse = (res, userToken) => {
  console.log("user");
  const token = createJWT(userToken);

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    signed: true,
    sameSite: "none",
    // domain: "https://deployreadye-store.onrender.com/",
  });
};
const configureBearerToken = async (req, userToken) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startWith("Bearer ")) {
    console.log(authHeader);
    throw new BadRequest("token error");
  }
  return authHeader;
};
export {
  createJWT,
  isTokenValid,
  attachCokkieToResponse,
  configureBearerToken,
};
