import * as orderService from '../services/orderService.js';
import { asyncHandler } from '../middleware/error-handler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const savedOrder = await orderService.createOrder(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: "Order created successfully",
    _id: savedOrder._id,
    data: savedOrder
  });
});

export const getUserOrderHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const { orders, pagination } = await orderService.getUserOrderHistory(req.user._id, page, limit);
  
  res.json({
    success: true,
    data: orders,
    pagination
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const order = await orderService.getOrderById(req.params.id, userId);
  
  res.json({
    success: true,
    data: order
  });
});