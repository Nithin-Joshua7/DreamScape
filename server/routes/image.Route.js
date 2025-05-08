import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { generateImage } from '../controllers/image.Controller.js';

const router = express.Router();

// Route to handle image generation
router.post('/generate', protectRoute, generateImage);

export default router;
