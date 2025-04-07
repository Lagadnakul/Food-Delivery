import { log } from 'console';
import foodModel from '../models/foodModel.js';
import fs from 'fs'; //rebuild in the node.js


//add food item

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

        // Handle image upload if present
        let image = '';
        if (req.file) {
            image = req.file.filename;
        }

        // Create new food item
        const food = new foodModel({
            name,
            description,
            price: Number(price),
            category,
            image
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

// all food list
const listFood = async (req,res) =>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch(error) {
        console.log(error);
        res.json({success:false,message:"Error"})

    }

}

//remove food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,() => {})

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Food removed"})

    } catch(error) {
        console.log(error);
        res.json({success:false,message:"Error"}) 

    }
     
}

export {addFood,listFood,removeFood} 