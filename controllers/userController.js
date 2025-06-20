const User = require("../models/users");
const jwt = require("jsonwebtoken");
const logActivity = require("../utils/logActivity");

exports.registerUser = async (req, res) => {
  try {
    const { username, password, role, status } = req.body;

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ username, password, role, status });
    await user.save();

    await logActivity({
      action: "User Registered",
      actorId: user._id,
      role,
      details: `${username} registered as ${role}`,
    });

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

    if (user.status === "inactive") {
      return res
        .status(400)
        .json({ message: "Sorry! Your logins are currently inactive" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const role = user.role;
    const status = user.status;

    await logActivity({
      action: "User Logged In",
      actorId: user._id,
      role: user.role,
      details: `${user.username} logged in`,
    });

    res.status(200).json({
      message: "Login successful. Redirecting...",
      token,
      role,
      status,
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

    await logActivity({
      action: `Deleted ${student.role}`,
      actorId: req.userId,
      role: req.userRole,
      details: `${student.username} (${student._id}) deleted`,
    });

    res.status(200).json({ message: "Student deleted successfully", student });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = { role: "admin" };

    const admins = await User.find(query)
      .select("_id username password")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      admins,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Fetch Admins Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteSingleAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOneAndDelete({ _id: id, role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await logActivity({
      action: `Deleted ${admin.role}`,
      actorId: req.userId,
      role: req.userRole,
      details: `${admin.username} (${admin._id}) deleted`,
    });

    res.status(200).json({ message: "Admin deleted successfully", admin });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllStaffs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = { role: "staff" };

    const staffs = await User.find(query)
      .select("_id username password")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      staffs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Fetch Staffs Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteSingleStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findOneAndDelete({ _id: id, role: "staff" });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    await logActivity({
      action: `Deleted ${staff.role}`,
      actorId: req.userId,
      role: req.userRole,
      details: `${staff.username} (${staff._id}) deleted`,
    });

    res.status(200).json({ message: "Staff deleted successfully", staff });
  } catch (error) {
    console.error("Delete Staff Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.bulkUpdateStatus = async (req, res) => {
  const { role } = req.params;
  const { status } = req.body;

  if (!["student", "staff", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const result = await User.updateMany({ role }, { status });

    await logActivity({
      action: `Bulk Status Update`,
      actorId: req.userId,
      role: req.userRole,
      details: `All ${role}s marked as ${status}`,
    });

    res.json({
      message: `All ${role}s marked as ${status}.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk status update error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
