import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/index.js";
const createProduct = async (req, res) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  console.log(product);

  res.status(StatusCodes.OK).json({ msg: "product created" });
};
const getAllProducts = async (req, res) => {
  const product = await Product.find({});
  res.status(StatusCodes.OK).json({ products: product });
};
const getSingleProduct = async (req, res) => {
  console.log("get single");
  const { id: productId } = req.params;
  console.log(productId);
  const product = await Product.findOne({ _id: productId });
  console.log(product);

  res.status(StatusCodes.OK).json(product);
};
const updateProduct = async (req, res) => {
  res.send("updateProduct");
};
const deleteProduct = async (req, res) => {
  res.send("deleteProduct");
};
const uploadImage = async (req, res) => {
  res.send("uploadImage");
};
export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProduct,
};
