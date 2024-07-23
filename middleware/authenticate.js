import { StatusCodes } from "http-status-codes";
import { isTokenValid } from "../utilis/jswt.js";
import { UnauthenticatedError, UnothorizedError } from "../errors/index.js";
const authenticate = async (req, res, next) => {
  console.log(req.headers);
  const { token } = req.signedCookies;

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
const authenticateBearerToken = async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Token invalid");
  }
  const token = authHeaders.split(" ")[1];

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
const checkIfAdmin = (...rest) => {
  console.log(rest);
  return (req, res, next) => {
    if (!rest.includes(req.user.role)) {
      throw new UnothorizedError("Unauthorized to acces this route");
    }
    next();
  };
};
export { authenticate, checkIfAdmin, authenticateBearerToken };
