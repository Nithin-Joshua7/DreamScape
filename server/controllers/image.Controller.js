import axios from 'axios';
import streamifier from 'streamifier';
import Message from '../models/Message.js';
import ENV_VARS from '../utils/envars.js';
import cloudinary from '../utils/cloudinary.js';
import protectRoute from '../middleware/protectRoute.js';
export const generateImage = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user._id; // Assuming authentication middleware

  // Validate prompt
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }

  try {
    // Make request to Hugging Face Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${ENV_VARS.HF_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: '*/*', // Explicitly allow all response types, including binary
        },
        responseType: 'arraybuffer', // Expect binary image data
      }
    );

    const imageBuffer = response.data;

    // Upload image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'dreamscape' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Cloudinary upload failed' });
        }

        // Save message to database
        try {
          const newMessage = new Message({
            user: userId,
            prompt,
            imageUrl: result.secure_url,
          });

          await newMessage.save();

          res.status(200).json({ imageUrl: result.secure_url, prompt });
        } catch (dbError) {
          console.error('Database save error:', dbError);
          res.status(500).json({ error: 'Failed to save message to database' });
        }
      }
    );

    // Pipe the image buffer to Cloudinary
    streamifier.createReadStream(imageBuffer).pipe(uploadStream);
  } catch (err) {
    console.error('Error generating image:', err);

    // Handle specific Hugging Face API errors
    if (err.response) {
      const status = err.response.status;
      const errorDetails = Buffer.from(err.response.data).toString(); // Decode buffer for details
      console.error(`Hugging Face API error: ${status} - ${errorDetails}`);

      if (status === 400) {
        return res.status(400).json({ error: 'Invalid request to Hugging Face API. Check prompt or headers.' });
      } else if (status === 429) {
        return res.status(429).json({ error: 'Hugging Face API rate limit exceeded. Please try again later.' });
      } else if (status === 401 || status === 403) {
        return res.status(401).json({ error: 'Invalid or unauthorized Hugging Face API key.' });
      }
    }

    res.status(500).json({ error: 'Failed to generate image' });
  }
};

const message =  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const messages = await Message.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('prompt imageUrl createdAt');
      const total = await Message.countDocuments({ user: req.user._id });
      res.status(200).json({ messages, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
}