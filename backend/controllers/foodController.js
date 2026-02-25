import * as foodService from '../services/foodService.js';
import { asyncHandler } from '../middleware/error-handler.js';

export const addFood = asyncHandler(async (req, res) => {
  const food = await foodService.addFood(req.body, req.file);
  res.status(201).json({
    success: true,
    message: "Food Added Successfully",
    data: food
  });
});

export const listFood = asyncHandler(async (req, res) => {
  const foods = await foodService.listFood();
  res.json({ success: true, data: foods });
});

export const removeFood = asyncHandler(async (req, res) => {
  await foodService.removeFood(req.body.id);
  res.json({ success: true, message: "Food removed" });
});