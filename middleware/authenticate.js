import { StatusCodes } from "http-status-codes";
import { isTokenValid } from "../utilis/jswt.js";
import { UnauthenticatedError, UnothorizedError } from "../errors/index.js";
const authenticate = async (req, res, next) => {
  const { token } = req.signedCookies;
  console.log("token is" + token);
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
const checkIfAdmin = (...rest) => {
  console.log(rest);
  return (req, res, next) => {
    if (!rest.includes(req.user.role)) {
      throw new UnothorizedError("Unauthorized to acces this route");
    }
    next();
  };
};
export { authenticate, checkIfAdmin };
