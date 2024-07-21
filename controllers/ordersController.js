import { BadRequest, NotFound } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import checkPermissions from "../utilis/checkPermission.js";
import Order from "../models/Orders.js";
const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json(orders);
};
const getSingleOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new NotFound(`order with id: ${id}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json(order);
};
const getCurrentUserOrder = async (req, res) => {
  const { _id } = req.user;
  const countSearchedProducts = await Order.find({
    user: _id,
  }).countDocuments();

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  const pages = Math.ceil(countSearchedProducts / limit);
  /* page 1 limit 3
      skip 0 * 3 = 0
      pages  7 / 3 = 3.5 = 3
      const order = await Order.find({ user: _id }).skip(0).limit(3)
    page 2 limit 3
      skip 1 * 3 = 3
      pages  7 / 3 = 3.5 = 3
      const order = await Order.find({ user: _id }).skip(3).limit(3)
    page 3 limit 3
      skip 2 * 3 = 6
      pages  7 / 3 = 3.5 = 3
      const order = await Order.find({ user: _id }).skip(6).limit(3)
  */
  const order = await Order.find({ user: _id }).skip(skip).limit(limit);
  if (!order) {
    throw new NotFound(`No orders found`);
  }

  res.status(StatusCodes.OK).json({
    order,
    meta: { pagination: { total: order.length, page, pages } },
  });
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
  const { id: orderId } = req.params;
  console.log(orderId);
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFound(`No orders found with id:${orderId}`);
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};
export {
  updateOrder,
  createOrder,
  getCurrentUserOrder,
  getSingleOrder,
  getAllOrders,
};
