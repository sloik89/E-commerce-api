import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
const router = express.Router();
router.get("/", getAllUsers);
router.get("/showme", showCurrentUser);
router.route("/:id").get(getSingleUser);
router.route("/").post(updateUser);
router.route("/updatepswd").post(updateUserPassword);
export default router;
