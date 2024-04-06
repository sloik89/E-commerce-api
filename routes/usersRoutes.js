import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import { authenticate, checkIfAdmin } from "../middleware/authenticate.js";
const router = express.Router();
router
  .route("/")
  .get(authenticate, checkIfAdmin("admin", "owner"), getAllUsers);
router.route("/showme").get(authenticate, showCurrentUser);
router.route("/:id").get(getSingleUser);
router.route("/").post(updateUser);
router.route("/updatepswd").post(authenticate, updateUserPassword);
export default router;
