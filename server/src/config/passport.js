import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";

import User from "../models/user.model.js";

dotenv.config();

// Replace with your actual Google client ID and secret
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        // 1️⃣ First: check if user with this email exists
        let user = await User.findOne({ email });

        if (user) {
          // 2️⃣ If googleId not set, add it
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          // 3️⃣ Else, create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            password: await bcrypt.hash(Math.random().toString(36), 10), // fake random pass if required
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and deserialize user (for session support, optional)
passport.serializeUser((user, done) => {
  done(null, user?._id?.toString() || user?.id?.toString());
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Explicit configuration function (for import side-effect)
export function configurePassport() {
  // No-op: ensures strategies are registered on import
}

export default passport;
