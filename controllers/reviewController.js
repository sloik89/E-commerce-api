import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { BadRequest, NotFound } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utilis/checkPermission.js";
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
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json(reviews);
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  console.log(reviewId);
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new BadRequest(`No review with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json(review);
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new BadRequest(`No review with id ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json(review);
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFound(`No review found with ${reviewId}`);
  }
  checkPermissions(req.user, review.user);

  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "review removed" });
};
// alternative aproach on reviews on single product
const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
