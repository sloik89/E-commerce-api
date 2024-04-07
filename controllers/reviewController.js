import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { BadRequest, NotFound } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  req.body.user = req.user._id;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NotFound(`No product with id: ${productId}`);
  }
  const alreadySubitted = await Review.findOne({
    product: productId,
    user: req.user._id,
  });
  if (alreadySubitted) {
    throw new BadRequest("Already subitted review fot this product");
  }
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  res.send("getAllReviews");
};
const getSingleReview = async (req, res) => {
  res.send("getSingleReview");
};
const updateReview = async (req, res) => {
  res.send("updateReview");
};
const deleteReview = async (req, res) => {
  res.send("deleteReview");
};
export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
