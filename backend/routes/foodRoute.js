import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import { upload, uploadToImageKit } from '../middleware/imageUpload.js';

const foodRouter = express.Router();

// Updated routes with ImageKit middleware
foodRouter.post("/add", upload.single("image"), uploadToImageKit, addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;