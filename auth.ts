import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

// Ensure Auth.js uses the production domain on Vercel rather than VERCEL_URL preview hash domains
if (!process.env.AUTH_URL && !process.env.NEXTAUTH_URL) {
  if (process.env.NODE_ENV === "production") {
    process.env.AUTH_URL =
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://harish-portfolio-wine-two.vercel.app";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
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
      const canonicalBase =
        process.env.AUTH_URL ||
        process.env.NEXTAUTH_URL ||
        baseUrl ||
        "https://harish-portfolio-wine-two.vercel.app";

      if (url.startsWith("/")) {
        return `${canonicalBase}${url}`;
      }
      try {
        const parsed = new URL(url);
        // If redirect target is any vercel.app deployment URL or matches canonical base, route to canonical domain
        if (
          parsed.origin === canonicalBase ||
          parsed.hostname.endsWith(".vercel.app") ||
          parsed.origin === baseUrl
        ) {
          return `${canonicalBase}${parsed.pathname}${parsed.search}`;
        }
      } catch {
        // fallback
      }
      return `${canonicalBase}/admin`;
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
