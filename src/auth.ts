import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { rateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();

        // Freno de fuerza bruta. Se limita por IP+email (ataque a una cuenta) y
        // por IP a secas (relleno de credenciales rotando emails). Al exceder se
        // devuelve null igual que una credencial mala: no revela el bloqueo y
        // cubre tambien los golpes directos a la API de NextAuth. El mensaje
        // "demasiados intentos" no se puede propagar de forma fiable aqui.
        const headers = (req?.headers ?? {}) as Record<string, string | undefined>;
        const ip = clientIpFromHeaders(headers["x-forwarded-for"], headers["x-real-ip"]);
        const perAccount = rateLimit(`login:${ip}:${email}`, { limit: 8, windowMs: 10 * 60_000 });
        const perIp = rateLimit(`login:ip:${ip}`, { limit: 40, windowMs: 10 * 60_000 });
        if (!perAccount.ok || !perIp.ok) return null;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
