const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db/index");
const { JWT_SECRET } = require("./config");
const bcrypt = require('bcrypt');

// Signup route
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            password: hashedPassword
        });

        res.json({ msg: "User created successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

// Signin route
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existuser = await User.findOne({ username });
        if (!existuser) {
            return res.status(411).json({ msg: "Not an existing user" });
        }

        const isMatch = await bcrypt.compare(password, existuser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ msg: "Login Successful", token });
    } catch (err) {
        res.status(500).json({ msg: "Error logging in", error: err.message });
    }
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const resetToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        res.json({ msg: "Password reset token generated", token: resetToken });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

// Reset password route
router.post("/reset-password", async (req, res) => {
    const { newPassword, token } = req.body;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const existUser = await User.findOne({ username: decoded.username });
        if (!existUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        existUser.password = hashedPassword;
        await existUser.save();

        res.json({ msg: "Password has been reset successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

module.exports = router;
