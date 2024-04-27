import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
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
  });
};
export { createJWT, isTokenValid, attachCokkieToResponse };
