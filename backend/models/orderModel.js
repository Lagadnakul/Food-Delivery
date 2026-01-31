import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    instructions: { type: String }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  payment: {
    method: { type: String, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);