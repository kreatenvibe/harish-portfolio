import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    // Reject the sign-in itself for any Google account not on the allow-list,
    // so no session is ever issued for a non-admin account.
    async signIn({ user }) {
      return !!user.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/admin`;
    },
    // Gates proxy.ts: since signIn already blocks non-admin accounts,
    // any existing session here is guaranteed to be an admin.
    authorized({ auth, request: { nextUrl } }) {
      if (nextUrl.pathname === "/admin/login") return true;
      return !!auth?.user;
    },
  },
  secret: process.env.AUTH_SECRET,
});
