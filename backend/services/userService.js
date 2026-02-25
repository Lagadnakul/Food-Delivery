import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/userModel.js';
import { ValidationError, UnauthorizedError, NotFoundError } from '../utils/errors.js';

export const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const loginUser = async (email, password) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new UnauthorizedError("Invalid email or password");
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError("Invalid email or password");
    
    const token = createToken(user._id);
    return { user, token };
};

export const registerUser = async ({ name, password, email, phone }) => {
    const exists = await userModel.findOne({ email });
    if (exists) throw new ValidationError("User already exists");

    if (!validator.isEmail(email)) {
        throw new ValidationError("Please enter a valid email");
    }

    if (password.length < 8) {
        throw new ValidationError("Password should be at least 8 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        phone: phone || ''
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    return { user, token };
};

export const getUserProfile = async (userId) => {
    const user = await userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundError("User not found");
    return user;
};

export const updateUserProfile = async (userId, { name, phone }) => {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    await user.save();
    return user;
};

export const addAddress = async (userId, { name, address, phone, label, isDefault }) => {
    if (!name || !address || !phone) {
        throw new ValidationError("Name, address and phone are required");
    }
    
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    
    const newAddress = {
        name,
        address,
        phone,
        label: label || 'home',
        isDefault: isDefault || false
    };
    
    if (newAddress.isDefault) {
        if (user.addresses && user.addresses.length > 0) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }
    } else if (!user.addresses || user.addresses.length === 0) {
        newAddress.isDefault = true;
    }
    
    if (!user.addresses) user.addresses = [];
    user.addresses.push(newAddress);
    
    await user.save();
    return user;
};

export const updateAddress = async (userId, addressId, { name, address, phone, label, isDefault }) => {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    
    if (!user.addresses || user.addresses.length === 0) {
        throw new NotFoundError("No addresses found");
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
        throw new NotFoundError("Address not found");
    }
    
    if (name) user.addresses[addressIndex].name = name;
    if (address) user.addresses[addressIndex].address = address;
    if (phone) user.addresses[addressIndex].phone = phone;
    if (label) user.addresses[addressIndex].label = label;
    
    if (isDefault === true) {
        user.addresses.forEach((addr, index) => {
            addr.isDefault = index === addressIndex;
        });
    }
    
    await user.save();
    return user;
};

export const deleteAddress = async (userId, addressId) => {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    
    if (!user.addresses || user.addresses.length === 0) {
        throw new NotFoundError("No addresses found");
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
        throw new NotFoundError("Address not found");
    }
    
    const isDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);
    
    if (isDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }
    
    await user.save();
    return user;
};

export const setDefaultAddress = async (userId, addressId) => {
    const user = await userModel.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    
    if (!user.addresses || user.addresses.length === 0) {
        throw new NotFoundError("No addresses found");
    }
    
    const addressExists = user.addresses.some(addr => addr._id.toString() === addressId);
    if (!addressExists) {
        throw new NotFoundError("Address not found");
    }
    
    user.addresses.forEach(addr => {
        addr.isDefault = addr._id.toString() === addressId;
    });
    
    await user.save();
    return user;
};
