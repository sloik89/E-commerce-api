import express from "express";

import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticate, checkIfAdmin } from "../middleware/authenticate.js";
const router = express.Router();
router.route("/").get(getAllReviews).post(authenticate, createReview);
router
  .route("/:id")
  .get(authenticate, getSingleReview)
  .patch(authenticate, updateReview)
  .delete(authenticate, deleteReview);
export default router;
