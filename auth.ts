import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authConfig } from './auth.config';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// There is exactly one authorized account for this app: the bishopric
// login. Its email and bcrypt password hash live in env vars rather than
// a database table, since there's no multi-user model here.
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
  const parsed = credentialsSchema.safeParse(credentials);
  if (!parsed.success) {
    console.log('AUTH DEBUG: schema validation failed', parsed.error);
    return null;
  }

  const { email, password } = parsed.data;


const ownerEmail = process.env.OWNER_EMAIL;
const ownerPasswordHash = process.env.OWNER_PASSWORD_HASH;


  if (!ownerEmail || !ownerPasswordHash) {
    console.error('OWNER_EMAIL or OWNER_PASSWORD_HASH is not set.');
    return null;
  }

  if (email.toLowerCase() !== ownerEmail.toLowerCase()) {
    console.log('AUTH DEBUG: email mismatch');
    return null;
  }

  const passwordsMatch = await bcrypt.compare(password, ownerPasswordHash);
  console.log('AUTH DEBUG: passwords match =', passwordsMatch);
  if (!passwordsMatch) return null;

  return { id: 'bishopric', email: ownerEmail, name: 'Bishopric' };
},
    }),
  ],
});