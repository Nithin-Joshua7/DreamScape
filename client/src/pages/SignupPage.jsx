import React, { useRef, useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authstore";
import toast from "react-hot-toast";

const SignupPage = () => {
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const demoRef = useRef(null);
  const signupFormRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleJoinNowClick = () => {
    signupFormRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavScroll = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

 
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full flex items-center justify-between px-8 py-4 bg-gradient-to-r from-black via-gray-900 to-black shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
          DreamScape AI
        </h1>

        <div className="hidden md:flex gap-10 text-white font-medium">
          <button onClick={() => handleNavScroll(aboutRef)} className="hover:text-pink-400 transition">About</button>
          <button onClick={() => handleNavScroll(featuresRef)} className="hover:text-pink-400 transition">Features</button>
          <button onClick={() => handleNavScroll(demoRef)} className="hover:text-pink-400 transition">Demo</button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleJoinNowClick}
            className="px-4 py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-500 hover:text-black transition"
          >
            Join Now
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-yellow-400 text-yellow-400 rounded-md hover:bg-yellow-400 hover:text-black transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* About Section */}
      <div
        ref={aboutRef}
        className=" bg-gradient-to-r from-black via-gray-900 to-black text-white px-6 py-14 flex flex-col items-center text-center"
      >
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-10">
          DreamScape AI
        </h1>

        <p className="text-lg text-gray-300 max-w-3xl">
          DreamScape AI is your creative partner for generating high-quality, artistic wallpapers using the power of Artificial Intelligence. Whether you're a designer, developer, or dreamer, our tool allows you to bring your vision to life — instantly.
        </p>
      </div>

      {/* Features Section */}
      <div
        ref={featuresRef}
        className="bg-gradient-to-r from-black via-gray-900 to-black text-white px-6 py-14"
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2 text-pink-400">Prompt-Based Generation</h3>
            <p className="text-gray-300 text-sm">
              Just describe what you imagine — our AI does the rest. You’ll get stunning visuals based on your input.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2 text-pink-400">Easy & Fast</h3>
            <p className="text-gray-300 text-sm">
              No need for complex tools. Generate wallpaper ideas in seconds with a smooth and intuitive experience.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2 text-pink-400">Unlimited Creativity</h3>
            <p className="text-gray-300 text-sm">
              Explore endless artistic styles and variations. There’s no limit to what you can create with DreamScape.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div
        ref={demoRef}
        className="w-full bg-gradient-to-r from-black via-gray-900 to-black text-white py-14 px-6 flex justify-center"
      >
        <div className="relative group w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl">
          <video
            className="w-full max-h-[500px] object-cover rounded-xl"
            controls
            loop
          >
            <source src="/v.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="pointer-events-none absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle size={64} className="text-white group-hover:text-pink-500 transition duration-300" />
          </div>
        </div>
      </div>

      {/* Signup Section */}
      <div
        ref={signupFormRef}
        className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white px-6 py-14 flex flex-col items-center"
      >
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl mt-10 text-white">
          <h3 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">
            Sign up to DreamScape AI
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-transparent focus:ring-2 focus:ring-pink-500 transition"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-transparent focus:ring-2 focus:ring-pink-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-black rounded-lg font-semibold hover:bg-pink-600 transition"
              disabled={isSigningUp}
            >
               {isSigningUp ? (
               <>
               <div className="flex items-center justify-center gap-2">
                 <Loader2 className="h-5 w-5 animate-spin text-white" />
                 <span>Creating account</span>
               </div>
             </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-300">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-pink-400 hover:text-pink-500">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
