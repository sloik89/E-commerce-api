import express from "express";
const router = express.Router();
import { authenticate, checkIfAdmin } from "../middleware/authenticate.js";
import {
  updateOrder,
  createOrder,
  getCurrentUserOrder,
  getSingleOrder,
  getAllOrders,
} from "../controllers/ordersController.js";
router
  .route("/")
  .get(authenticate, checkIfAdmin("admin"), getAllOrders)
  .post(authenticate, createOrder);
router.route("/showAllMyOrder").get(authenticate, getCurrentUserOrder);
router
  .route("/:id")
  .get(authenticate, getSingleOrder)
  .patch(authenticate, updateOrder);
export default router;
