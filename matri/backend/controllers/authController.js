import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    password = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password });

    res.json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// export const login = async (req, res) => {
//   try {
//     let { email, password } = req.body;

//     let user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "Invalid email" });

//     let match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ msg: "Invalid password" });

//     let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.json({ msg: "Login successful", token });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
