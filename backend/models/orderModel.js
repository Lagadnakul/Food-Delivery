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
    instructions: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  payment: {
    method: { type: String, required: true, enum: ['cod', 'online', 'razorpay'] },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paidAt: { type: Date }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'payment_failed'],
    default: 'pending' 
  },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }],
  estimatedDeliveryTime: { type: Number }, // in minutes
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Add status to history on status change
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);