import foodModel from '../models/foodModel.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export const addFood = async ({ name, description, price, category }, fileData) => {
    if (!name || !description || !price || !category) {
        throw new ValidationError("All fields are required");
    }

    let image = '';
    let imageData = {};
    
    if (fileData && fileData.imagekit) {
        image = fileData.imagekit.url;
        imageData = {
            fileId: fileData.imagekit.fileId,
            thumbnailUrl: fileData.imagekit.thumbnailUrl
        };
    } else if (!fileData) {
        throw new ValidationError("Image is required");
    }

    const food = new foodModel({
        name,
        description,
        price: Number(price),
        category,
        image,
        imageKit: imageData
    });

    await food.save();
    return food;
};

export const listFood = async () => {
    return await foodModel.find({});
};

export const removeFood = async (id) => {
    const food = await foodModel.findById(id);
    if (!food) {
        throw new NotFoundError("Food item not found");
    }
    
    // Attempt ImageKit deletion if it exists
    if (food.imageKit && food.imageKit.fileId) {
        try {
            const imagekit = (await import('../config/imagekit.js')).default;
            await imagekit.deleteFile(food.imageKit.fileId);
        } catch (imageKitError) {
            console.error("ImageKit deletion error:", imageKitError);
            // Continue deletion even if it fails
        }
    }

    await foodModel.findByIdAndDelete(id);
};
