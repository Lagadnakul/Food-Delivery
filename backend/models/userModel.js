import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  label: { type: String, enum: ['home', 'work', 'other'], default: 'home' }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Array, default: {} },
  addresses: [addressSchema],
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { minimize: false });

// Update the timestamp when document is updated
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;