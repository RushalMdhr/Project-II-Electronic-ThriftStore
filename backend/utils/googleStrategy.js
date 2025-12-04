import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import "dotenv/config";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile received:", profile);
        
        // Check by googleId OR email
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails?.[0]?.value }
          ]
        });

        if (!user) {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName || `user_${Date.now()}`,
            email: profile.emails?.[0]?.value,
            profilePic: profile.photos?.[0]?.value,
            isEmailVerified: true,
            // password: "google-auth-no-password" // Required field
          });
          console.log("New Google user created:", user.email);
        } else {
          // Update existing user with googleId if missing
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          console.log("Existing user found:", user.email);
        }

        return done(null, user);
      } catch (err) {
        console.error("Google auth error:", err);
        return done(err, null);
      }
    }
  )
);
