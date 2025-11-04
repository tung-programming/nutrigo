"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "nutrigo_secret_key";
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const existing = await User_1.User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "User already exists" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.User.create({ name, email, password: hashed });
        return res.status(201).json({ message: "User registered", user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        return res.status(500).json({ message: "Registration failed", error: err });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Missing fields" });
        const user = await User_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        return res.status(500).json({ message: "Login failed", error: err });
    }
};
exports.loginUser = loginUser;
