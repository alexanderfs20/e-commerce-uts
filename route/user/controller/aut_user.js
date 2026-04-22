const User = require('../../../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { generateToken } = require('../../../utils/jwt');

// Setup Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- REGISTER ---
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailToken = crypto.randomBytes(64).toString('hex');

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            emailToken
        });

        await newUser.save();

        const verificationLink = `http://${req.headers.host}/api/user/verify-email?token=${emailToken}`;

        await transporter.sendMail({
            to: email,
            subject: 'Verifikasi Akun E-Commerce Kamu',
            html: `<h2>Klik <a href="${verificationLink}">di sini</a> untuk verifikasi akun kamu.</h2>`
        });

        res.status(201).json({ message: "Registrasi berhasil. Cek email untuk verifikasi." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- VERIFY EMAIL ---
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ emailToken: token });

        if (!user) return res.status(400).json({ message: "Token tidak valid" });

        user.isVerified = true;
        user.emailToken = undefined;
        await user.save();

        res.json({ message: "Email berhasil diverifikasi! Silakan login." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Email atau password salah" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Verifikasi email dulu!" });
        }

        const token = generateToken({
            id: user._id,
            role: user.role
        });

        res.json({
            message: `Selamat datang ${user.role}`,
            token,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "Email tidak ditemukan" });

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `http://${req.headers.host}/api/user/reset-password/${resetToken}`;

        await transporter.sendMail({
            to: email,
            subject: 'Reset Password',
            html: `Klik <a href="${resetLink}">di sini</a> untuk reset password.`
        });

        res.json({ message: "Link reset password dikirim ke email." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Token tidak valid / kadaluwarsa" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password berhasil direset!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};