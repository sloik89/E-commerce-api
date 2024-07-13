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
  const { featured, company, search, category, price, shipping } = req.query;

  const order = req.query.order || "a-z";

  const totalProducts = await Product.countDocuments();
  const searchedObj = {};
  // building meta response
  const metaResponse = await Product.find({});
  const categories = [
    "all",
    ...new Set(metaResponse.map((item) => item.category)),
  ];
  const companies = [
    "all",
    ...new Set(metaResponse.map((item) => item.company)),
  ];
  if (shipping) {
    searchedObj.freeShipping = shipping === "on" ? true : false;
    console.log(searchedObj);
  }
  if (featured) {
    searchedObj.featured = featured;
  }
  if (company) {
    searchedObj.company = company;
    if (company === "all") {
      delete searchedObj.company;
    }
  }
  if (search) {
    searchedObj.name = { $regex: search, $options: "i" };
  }
  if (price) {
    console.log(price);
    searchedObj.price = { $lte: price };
  }
  if (category) {
    searchedObj.category = category;
    if (category === "all") {
      delete searchedObj.category;
    }
  }
  let result = Product.find(searchedObj);
  if (order) {
    if (order === "a-z") {
      result.sort("name");
    } else if (order === "z-a") {
      result.sort("-name");
    } else if (order === "high") {
      result.sort("-price");
    } else if (order === "low") {
      result.sort("price");
    }
  }

  // dynamic pagination
  const countSearchedProducts = await Product.find(
    searchedObj
  ).countDocuments();

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 3;
  const skip = (page - 1) * limit;
  const pages = Math.ceil(countSearchedProducts / limit);
  result = result.skip(skip).limit(limit);
  const products = await result;
  console.log(products.length);

  res.status(StatusCodes.OK).json({
    products: products,
    numofHists: products.length,
    totalProducts,
    meta: { categories, companies, pagination: { page, pages } },
  });
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
