import { BadRequest, NotFound } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import Review from "../models/Review.js";
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
  res.send("createOrder");
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
