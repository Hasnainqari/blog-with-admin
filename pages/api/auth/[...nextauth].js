import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";

// ✅ EXPORT authOptions (VERY IMPORTANT)
export const authOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // ✅ RETURN EVERYTHING NEEDED BY APP
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email.split("@")[0], // ✅ SAFE NAME
          role: user.role, // ✅ CRITICAL
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name; // ✅ SAVE NAME
        
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name; // ✅ EXPOSE NAME
      return session;
    },
  },
};

// ✅ DEFAULT EXPORT
export default NextAuth(authOptions);
