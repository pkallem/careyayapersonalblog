import NextAuth , { AuthOptions, Session as NextAuthSession, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";

interface Session extends NextAuthSession {
  user: {
    name: string;
    email: string;
    image: string;
    id?: string;
  };
}

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: '0ae75bbfb9e3d585d72e',
      clientSecret: 'fb24571af8e2647ef10af965f96a6368bd7fc27e',  // Change this to your actual GitHub client secret
    }),
  ],
  theme: {
    colorScheme: "dark",
  },
  callbacks: {
    async session(sessionContext: {session: NextAuthSession, user?: User | undefined}) {
      const nextAuthSession = sessionContext.session as Session; // cast Session
      if (sessionContext.user) {
        nextAuthSession.user.id = sessionContext.user.id;
      }
      return nextAuthSession;
    },
  },
};

export default NextAuth(authOptions);
