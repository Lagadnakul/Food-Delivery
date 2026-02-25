import * as userService from '../services/userService.js';
import { asyncHandler } from '../middleware/error-handler.js';

// login user
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    
    res.json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            addresses: user.addresses
        },
        token
    });
});

// register user
export const registerUser = asyncHandler(async (req, res) => {
    const { user, token } = await userService.registerUser(req.body);
    
    res.status(201).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            addresses: user.addresses || []
        },
        token
    });
});

// get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.user._id);
    
    res.json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            addresses: user.addresses || []
        }
    });
});

// update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateUserProfile(req.user._id, req.body);
    
    res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            addresses: user.addresses || []
        }
    });
});

// add new address
export const addAddress = asyncHandler(async (req, res) => {
    const user = await userService.addAddress(req.user._id, req.body);
    
    res.status(201).json({
        success: true,
        message: "Address added successfully",
        addresses: user.addresses
    });
});

// update address
export const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await userService.updateAddress(req.user._id, addressId, req.body);
    
    res.json({
        success: true,
        message: "Address updated successfully",
        addresses: user.addresses
    });
});

// delete address
export const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await userService.deleteAddress(req.user._id, addressId);
    
    res.json({
        success: true,
        message: "Address deleted successfully",
        addresses: user.addresses
    });
});

// set default address
export const setDefaultAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await userService.setDefaultAddress(req.user._id, addressId);
    
    res.json({
        success: true,
        message: "Default address updated successfully",
        addresses: user.addresses
    });
});
