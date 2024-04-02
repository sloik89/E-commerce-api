import { StatusCodes } from "http-status-codes";
import { isTokenValid } from "../utilis/jswt.js";
import UnauthenticatedError from "../errors/unauthenticate.js";
const authenticate = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError("Authenticate Invalid");
  }
  try {
    const { name, _id, role } = isTokenValid(token);
    req.user = {
      name,
      _id,
      role,
    };

    next();
  } catch (err) {
    throw new UnauthenticatedError("Authenticate Invalid");
  }
};
export default authenticate;
