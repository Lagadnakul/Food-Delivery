import { Order } from '../models/orderModel.js';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/errors.js';

export const createOrder = async (userId, data) => {
  const { customer, items, payment } = data;
  
  if (!customer || !customer.name || !customer.phone || !customer.address) {
    throw new ValidationError("Missing required customer information", ["Customer name, phone, and address are required"]);
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError("Order must contain at least one item", ["No items in order"]);
  }
  
  if (!payment || !payment.method || typeof payment.total !== 'number') {
    throw new ValidationError("Missing payment information", ["Payment method and total are required"]);
  }
  
  const newOrder = new Order({
    user: userId,
    customer: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      instructions: customer.instructions || ''
    },
    items: items.map(item => ({
      productId: String(item.productId || item._id || item.id),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || ''
    })),
    payment: {
      method: payment.method,
      subtotal: Number(payment.subtotal),
      tax: Number(payment.tax),
      deliveryFee: Number(payment.deliveryFee),
      total: Number(payment.total)
    },
    status: 'pending'
  });
  
  return await newOrder.save();
};

export const getUserOrderHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Order.countDocuments({ user: userId });
  
  return {
    orders,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getOrderById = async (orderId, userId) => {
  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    if (err.name === 'CastError') {
      throw new ValidationError("Invalid order ID format");
    }
    throw err;
  }
  
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  
  if (userId && order.user.toString() !== userId.toString()) {
    throw new ForbiddenError("Not authorized to access this order");
  }
  
  return order;
};
