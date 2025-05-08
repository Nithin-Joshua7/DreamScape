import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Send, History } from 'lucide-react';
import toast from 'react-hot-toast';
import useImageStore from '../../store/useImageStore';
import useAuthStore from '../../store/authstore';

const HomePage = () => {
  const { logout, authUser } = useAuthStore();
  const {
    messages,
    isGenerating,
    error,
    fetchMessages,
    generateImage,
    deleteMessage,
  } = useImageStore();

  const [prompt, setPrompt] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      fetchMessages();
    }
  }, [authUser, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await generateImage(prompt);
    setPrompt('');
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleDelete = async (messageId) => {
    if (!messageId) {
      toast.error('Cannot delete: Message ID is missing');
      return;
    }
    await deleteMessage(messageId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-between px-6 py-4  shadow-md">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">
          DreamScape AI
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleHistory}
            className="text-gray-400 hover:text-gray-200 transition"
            title="View History"
          >
            <History className="w-6 h-6" />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 transition font-semibold"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-l border-white/10 shadow-lg z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">History</h2>
            <button
              onClick={toggleHistory}
              className="text-gray-400 hover:text-gray-200"
              title="Close History"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {(!Array.isArray(messages) || messages.length === 0) ? (
            <p className="text-gray-500 text-sm">No wallpapers generated yet.</p>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4">
              {[...messages].reverse().map((message) => (
                <div key={message.id || Math.random()} className="relative flex-shrink-0">
                  <img
                    src={message.imageUrl}
                    alt={message.prompt}
                    className="w-[100px] h-[100px] object-cover rounded-md"
                    title={message.prompt}
                  />
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Delete"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-400 mt-1 truncate w-[100px]">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Show welcome only when messages are empty */}
        {messages.length === 0 && (
          <div className="text-center mb-10">
            <p className="text-lg text-gray-400">
              Welcome, <span className="text-white font-semibold">{authUser?.email}</span>!<br />
              Describe your dream wallpaper below and let AI bring it to life.
            </p>
          </div>
        )}

        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}

        {/* Chat Messages */}
        <div className="flex flex-col gap-6">
          {[...messages].reverse().map((msg, index) => (
            <div key={msg.id || index} className="space-y-2">
              {/* Prompt (left aligned) */}
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl px-4 py-2 text-sm max-w-[80%] shadow">
                  <span className="text-pink-400 font-semibold">You:</span> {msg.prompt}
                </div>
              </div>

              {/* Image (right aligned) */}
              <div className="flex justify-end">
                <div className="bg-gray-700 rounded-2xl overflow-hidden max-w-[60%] shadow">
                  <img
                    src={msg.imageUrl}
                    alt={msg.prompt}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Prompt Input */}
      <form
        onSubmit={handleSubmit}
        className="w-full px-4 py-6    "
      >
        <div className="max-w-3xl mx-auto flex items-center bg-gray-800 rounded-full px-5 py-3 shadow-lg">
          <input
            type="text"
            placeholder="Describe your dream wallpaper..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none pr-3"
            disabled={isGenerating}
          />
          <button
            type="submit"
            className="text-pink-500 hover:text-pink-600 transition"
            title="Send"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
