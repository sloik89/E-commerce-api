import { BadRequest, NotFound } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Orders.js";
const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};
const getAllOrders = async (req, res) => {
  res.send("getAllORders");
};
const getSingleOrder = async (req, res) => {
  res.send("getSIngleORder");
};
const getCurrentUserOrder = async (req, res) => {
  res.send("getCurrentUserOrder");
};
const createOrder = async (req, res) => {
  const { cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequest("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new BadRequest("Please provide tax and shipping fee");
  }
  let ordersItem = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFound(`No product with id: ${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      product: _id,
      image: item.image,
    };
    ordersItem = [...ordersItem, singleOrderItem];
    subtotal += item.amount * price;
  }
  const total = shippingFee + tax + subtotal;
  const paymentIntent = await fakeStripeApi({ amount: total, currency: "usd" });
  console.log(ordersItem);
  const order = await Order.create({
    tax,
    shippingFee,
    total,
    subtotal,
    cartItems: ordersItem,
    clientSecret: paymentIntent.client_secret,
    user: req.user._id,
  });

  console.log(subtotal);
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
const updateOrder = async (req, res) => {
  res.send("updateOrder");
};
export {
  updateOrder,
  createOrder,
  getCurrentUserOrder,
  getSingleOrder,
  getAllOrders,
};
