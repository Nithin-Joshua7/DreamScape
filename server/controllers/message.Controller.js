import Message from "../models/Message.js";
import { Types } from 'mongoose';
export const message =  async (req, res) => {
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

export const deleteMessage =  async (req, res) => {
    try {
      const messageId = req.params.id;
      const userId = req.user.userId; // From JWT payload
      const objectId = new Types.ObjectId(messageId);      // Find and delete the message for the authenticated user
      const result = await Message.findOneAndDelete({
        _id: objectId,
        userId: userId,
      });
  console.log(userId)
      if (!result) {
        return res.status(404).json({ error: 'Message not found or not authorized' });
      }
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  };
  