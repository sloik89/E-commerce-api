import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { BadRequest, NotFound } from "../errors/index.js";
const createProduct = async (req, res) => {
  req.body.user = req.user._id;
  console.log(req.body);
  const product = await Product.create(req.body);

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
  const product = await Product.findOne({ _id: productId }).populate("reviews");
  console.log(product);

  res.status(StatusCodes.OK).json(product);
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(product);
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFound("Can find product");
  }
  console.log(product);
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "product remove" });
};
const uploadImage = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    throw new BadRequest("No File uploades");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequest("Please upload image");
  }
  const maxSize = 1024 * 1024;
  if (!productImage.size > maxSize) {
    throw new BadRequest("Please upload image smaller than 1MB");
  }
  const __dirname = path.resolve();
  console.log(__dirname);

  const imagePath = path.join(
    __dirname,
    "/public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};
export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProduct,
};
