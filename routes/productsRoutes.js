import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProduct,
} from "../controllers/productsController.js";
import { authenticate, checkIfAdmin } from "../middleware/authenticate.js";
const router = express.Router();
router
  .route("/uploadImage")
  .post(authenticate, checkIfAdmin("admin"), uploadImage);
router.route("/").get(getAllProducts);
router.route("/").post(authenticate, checkIfAdmin("admin"), createProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticate, checkIfAdmin("admin"), updateProduct)
  .delete(authenticate, checkIfAdmin("admin"), deleteProduct);

export default router;
