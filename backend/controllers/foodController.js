import { log } from 'console';
import foodModel from '../models/foodModel.js';
import fs from 'fs'; //rebuild in the node.js

// Add food item with ImageKit integration
const addFood = async (req, res) => {
  try {
    // Validate request body
    const { name, description, price, category } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Get image data from ImageKit upload
    let image = '';
    let imageData = {};
    
    if (req.file && req.file.imagekit) {
      image = req.file.imagekit.url;
      imageData = {
        fileId: req.file.imagekit.fileId,
        thumbnailUrl: req.file.imagekit.thumbnailUrl
      };
    } else if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    // Create new food item
    const food = new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image,
      imageKit: imageData
    });

    // Save to database
    await food.save();
    
    res.status(201).json({
      success: true,
      message: "Food Added Successfully",
      data: food
    });
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding food item",
      error: error.message
    });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({success: true, data: foods});
  } catch(error) {
    console.log(error);
    res.json({success: false, message: "Error fetching food items"});
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found"
      });
    }
    
    // If the food has an ImageKit fileId, delete from ImageKit
    if (food.imageKit && food.imageKit.fileId) {
      try {
        const imagekit = (await import('../config/imagekit.js')).default;
        await imagekit.deleteFile(food.imageKit.fileId);
      } catch (imageKitError) {
        console.error("ImageKit deletion error:", imageKitError);
        // Continue with deletion even if ImageKit deletion fails
      }
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success: true, message: "Food removed"});
  } catch(error) {
    console.log(error);
    res.json({success: false, message: "Error removing food item"});
  }
};

export { addFood, listFood, removeFood };