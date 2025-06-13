const User = require("../models/users");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const role = user.role;

    res.status(200).json({
      message: "Login successful. Redirecting...",
      token,
      role,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = { role: "student" };

    const students = await User.find(query)
      .select("_id username password")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      students,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Fetch Students Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOneAndDelete({ _id: id, role: "student" });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully", student });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
