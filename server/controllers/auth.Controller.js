import bcrypt from "bcryptjs";
import User from "../models/usermodel.js";
import generateToken from "../utils/generateToken.js";

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const user = await User.create({ email, password: hashedPassword });

    // Generate token and set it as a cookie
    await generateToken(user._id, res);

    // Return success message with user details
    return res.status(201).json({
      message: "User created successfully",
      user: { ...user._doc, password: "" },  // Don't send the password
    });
  } catch (error) {
    console.log(`Error in signup controller: ${error}`);
    return res.status(400).json({ message: "Signup failed" });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const passCheck = await bcrypt.compare(password, existingUser.password);

    if (!passCheck)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate token and set it as a cookie
    await generateToken(existingUser._id, res);

    // Return success message with user details
    return res.status(200).json({
      message: "Login successful",
      user: { ...existingUser._doc, password: "" },  // Don't send the password
    });
  } catch (error) {
    console.log(`Error in login controller: ${error}`);
    return res.status(400).json({ message: "Login failed" });
  }
};


export const logout = (req, res) => {
    try {
      // Clear the JWT cookie
      res.clearCookie("jwt", {
        httpOnly: true, // Prevent JavaScript access
        sameSite: "strict", // Prevent CSRF attacks
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      });
  
      // Send success response
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log(`Error in logout controller: ${error}`);
      return res.status(400).json({ message: "Logout failed" });
    }
  };
  

  export const authcheck = (req,res)=>{
    try {
        console.log(req.user)
        res.status(200).json({user:req.user})
    } catch (error) {
        console.log("Error in authCheck controller", error);
		res.status(500).json({ message: "Internal server error" });
    }
  }