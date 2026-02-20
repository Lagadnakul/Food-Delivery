import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';

// Create token function - moved to the top so it can be used by both login and register
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// login user 
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" });
        }
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" });
        }
        
        // Create token
        const token = createToken(user._id);
        
        // Return user info
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
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

// register user
const registerUser = async (req, res) => {
    const { name, password, email, phone } = req.body;
    try {
        // checking if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password should be at least 8 characters" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone || ''
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        
        // Return user info along with token for consistency with login
        res.json({
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

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

// get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// update user profile
const updateUserProfile = async (req, res) => {
    const { name, phone } = req.body;
    
    try {
        const user = await userModel.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        if (name) user.name = name;
        if (phone) user.phone = phone;
        
        await user.save();
        
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// add new address
const addAddress = async (req, res) => {
    const { name, address, phone, label, isDefault } = req.body;
    
    try {
        if (!name || !address || !phone) {
            return res.status(400).json({ success: false, message: "Name, address and phone are required" });
        }
        
        const user = await userModel.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Create new address
        const newAddress = {
            name,
            address,
            phone,
            label: label || 'home',
            isDefault: isDefault || false
        };
        
        // If this is set as default, update all other addresses
        if (newAddress.isDefault) {
            if (user.addresses && user.addresses.length > 0) {
                user.addresses.forEach(addr => {
                    addr.isDefault = false;
                });
            }
        }
        // If this is the first address, make it default
        else if (!user.addresses || user.addresses.length === 0) {
            newAddress.isDefault = true;
        }
        
        // Add to addresses array
        if (!user.addresses) {
            user.addresses = [];
        }
        user.addresses.push(newAddress);
        
        await user.save();
        
        res.json({
            success: true,
            message: "Address added successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// update address
const updateAddress = async (req, res) => {
    const { addressId } = req.params;
    const { name, address, phone, label, isDefault } = req.body;
    
    try {
        const user = await userModel.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        if (!user.addresses || user.addresses.length === 0) {
            return res.status(404).json({ success: false, message: "No addresses found" });
        }
        
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        
        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        
        // Update address
        if (name) user.addresses[addressIndex].name = name;
        if (address) user.addresses[addressIndex].address = address;
        if (phone) user.addresses[addressIndex].phone = phone;
        if (label) user.addresses[addressIndex].label = label;
        
        // Handle default address
        if (isDefault === true) {
            user.addresses.forEach((addr, index) => {
                addr.isDefault = index === addressIndex;
            });
        }
        
        await user.save();
        
        res.json({
            success: true,
            message: "Address updated successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// delete address
const deleteAddress = async (req, res) => {
    const { addressId } = req.params;
    
    try {
        const user = await userModel.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        if (!user.addresses || user.addresses.length === 0) {
            return res.status(404).json({ success: false, message: "No addresses found" });
        }
        
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        
        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        
        // Check if it's the default address
        const isDefault = user.addresses[addressIndex].isDefault;
        
        // Remove address
        user.addresses.splice(addressIndex, 1);
        
        // If it was the default and we have other addresses, make the first one default
        if (isDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }
        
        await user.save();
        
        res.json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// set default address
const setDefaultAddress = async (req, res) => {
    const { addressId } = req.params;
    
    try {
        const user = await userModel.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        if (!user.addresses || user.addresses.length === 0) {
            return res.status(404).json({ success: false, message: "No addresses found" });
        }
        
        const addressExists = user.addresses.some(addr => addr._id.toString() === addressId);
        
        if (!addressExists) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        
        // Update all addresses
        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === addressId;
        });
        
        await user.save();
        
        res.json({
            success: true,
            message: "Default address updated successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { 
    loginUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};