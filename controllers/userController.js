const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

const canSendEmail = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const transporter = canSendEmail
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : null;

const sendMailIfPossible = async options => {
  if (!transporter) {
    return;
  }

  await transporter.sendMail(options);
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email, dan password wajib diisi"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "buyer",
      emailToken
    });

    const verificationLink = `http://${req.headers.host}/api/users/verify-email?token=${emailToken}`;
    await sendMailIfPossible({
      to: email,
      subject: "Verifikasi akun e-commerce",
      html: `<p>Klik link berikut untuk verifikasi akun: <a href="${verificationLink}">${verificationLink}</a></p>`
    });

    res.status(201).json({
      message: canSendEmail
        ? "Registrasi berhasil. Cek email untuk verifikasi."
        : "Registrasi berhasil. Email verifikasi tidak dikirim karena konfigurasi email belum ada.",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified
      },
      verificationLink: canSendEmail ? undefined : verificationLink
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token verifikasi wajib diisi" });
    }

    const user = await User.findOne({ emailToken: token });

    if (!user) {
      return res.status(400).json({ message: "Token tidak valid" });
    }

    user.isVerified = true;
    user.emailToken = null;
    await user.save();

    res.json({ message: "Email berhasil diverifikasi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    res.json({
      message: "Login berhasil",
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `http://${req.headers.host}/api/users/reset-password/${resetToken}`;
    await sendMailIfPossible({
      to: email,
      subject: "Reset password",
      html: `<p>Klik link berikut untuk reset password: <a href="${resetLink}">${resetLink}</a></p>`
    });

    res.json({
      message: canSendEmail
        ? "Link reset password sudah dikirim ke email."
        : "Token reset berhasil dibuat. Email belum dikirim karena konfigurasi email belum ada.",
      resetLink: canSendEmail ? undefined : resetLink
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "newPassword wajib diisi" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token tidak valid atau kadaluarsa" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password berhasil direset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      message: "Profil berhasil diambil",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
