import { NextAuthOptions, Session } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

interface Credentials {
  email: string;
  password: string;
}

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    username?: string;
    role: string;
  };
}

interface CustomToken extends JWT {
  username?: string;
  role?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email und Passwort sind erforderlich');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          console.log('User not found:', credentials.email);
          throw new Error('Ungültige Anmeldedaten');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          console.log('Invalid password for user:', credentials.email);
          throw new Error('Ungültige Anmeldedaten');
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }): Promise<CustomToken> {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          role: token.role as string,
          username: token.username as string | undefined,
        },
      };
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 Stunden
  },
  secret: process.env.NEXTAUTH_SECRET,
};
