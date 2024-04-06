import { UnothorizedError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
  console.log(requestUser);
  console.log(resourceUserId);
  console.log(typeof requestUser);
  if (requestUser.role === "admin") return;
  if (requestUser._id === resourceUserId.toString()) return;
  throw new UnothorizedError("No authorized to access this route");
};
export default checkPermissions;
