import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";
const router = express.Router();
router.route("/").get(authenticate, getAllUsers);
router.get("/showme", showCurrentUser);
router.route("/:id").get(getSingleUser);
router.route("/").post(updateUser);
router.route("/updatepswd").post(updateUserPassword);
export default router;
