import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../src/lib/axios';

const useImageStore = create((set) => ({
  messages: [],
  isGenerating: false,
  error: null,

  fetchMessages: async () => {
    try {
      console.log('Fetching messages with headers:', axiosInstance.defaults.headers);
      const response = await axiosInstance.get('/messages');
      console.log('Raw API response:', response.data);
      console.log('Response data type:', typeof response.data, 'Is array?', Array.isArray(response.data));
      console.log('Response.data.messages exists?', !!response.data.messages, 'Is array?', Array.isArray(response.data.messages));
      const messages = Array.isArray(response.data.messages)
        ? response.data.messages.map((msg) => ({
            id: msg.id || msg._id?.toString() || String(Date.now() + Math.random()),
            prompt: msg.prompt,
            imageUrl: msg.imageUrl,
            createdAt: msg.createdAt || new Date(),
          }))
        : Array.isArray(response.data)
          ? response.data.map((msg) => ({
              id: msg.id || msg._id?.toString() || String(Date.now() + Math.random()),
              prompt: msg.prompt,
              imageUrl: msg.imageUrl,
              createdAt: msg.createdAt || new Date(),
            }))
          : [];
      console.log('Processed messages:', messages);
      set({ messages, error: null });
      console.log('State updated with messages:', messages);
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Failed to fetch messages';
      console.error('Error fetching messages:', errorMessage, error);
      set({ error: errorMessage, messages: [] });
      toast.error(errorMessage);
    }
  },

  generateImage: async (prompt) => {
    if (!prompt.trim()) {
      const errorMessage = 'Prompt cannot be empty';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return;
    }

    set({ isGenerating: true, error: null });

    try {
      const response = await axiosInstance.post('/images/generate', { prompt });
      const newMessage = {
        id: response.data.id || response.data._id?.toString() || String(Date.now()),
        prompt: response.data.prompt,
        imageUrl: response.data.imageUrl,
        createdAt: new Date(),
      };
      console.log('New message added:', newMessage);
      set((state) => ({
        messages: [newMessage, ...state.messages],
        error: null,
      }));
      toast.success('Image generated successfully');
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Failed to generate image';
      console.error('Error generating image:', errorMessage, error);
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isGenerating: false });
    }
  },

  deleteMessage: async (messageId) => {
    console.log('deleteMessage called with messageId:', messageId); // Debug log
    if (!messageId) {
      const errorMessage = 'Message ID is undefined';
      console.error('Error deleting message:', errorMessage);
      set({ error: errorMessage });
      toast.error(errorMessage);
      return;
    }

    try {
      console.log('Sending DELETE request for message ID:', messageId);
      await axiosInstance.delete(`/messages/delete/${messageId}`);
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== messageId),
        error: null,
      }));
      toast.success('Message deleted successfully');
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Failed to delete message';
      console.error('Error deleting message:', errorMessage, error);
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },
}));

export default useImageStore;