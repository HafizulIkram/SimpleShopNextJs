import CredentialsProvider from "next-auth/providers/credentials";

// Demo login. A real app would use users in a database and hashed passwords.
const DEMO_USER = {
  id: "1",
  name: "Trainer",
  username: "trainer",
  password: "hands-on",
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username !== DEMO_USER.username ||
          credentials?.password !== DEMO_USER.password
        ) {
          return null;
        }

        return { id: DEMO_USER.id, name: DEMO_USER.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};
