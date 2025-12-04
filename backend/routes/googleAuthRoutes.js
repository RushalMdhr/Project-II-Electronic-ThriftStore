// auth/googleStrategy.js
import express from "express";
import passport from "passport";
import generateToken from "../utils/createToken.js";
import User from "../models/userModel.js";
import { formatUserResponse } from "../utils/formatUserResponse.js";
const router = express.Router();

// 1. Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 2. Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    try {
      const user = req.user;

      // Generate JWT token for the user
      const token = generateToken(res, req.user._id);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      const formattedUser = formatUserResponse(user);

      // Redirect to frontend with token
      res.redirect(
        `http://localhost:5173/auth-success?token=${token}&user=${encodeURIComponent(
          JSON.stringify(formattedUser)
        )}`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("http://localhost:5173/login?error=auth_failed");
    }
  }
);

// ✅ REQUIRED FOR SESSION LOGIN
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default router;
