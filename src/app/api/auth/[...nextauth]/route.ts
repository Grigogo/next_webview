import { IUser } from "@/lib/types";
import axios from "axios";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        Phone: {
          label: "Номер телефона",
          type: "text",
          placeholder: "Ваш номер",
        },
        Pin: {
          label: "Пароль",
          type: "password",
          placeholder: "Пин",
        },
      },

      async authorize(credentials) {
        try {
          // Step 1: Obtain the access token
          const tokenResponse = await axios.post(
            "https://el2ka.vensta.ru/api/oauth/token",
            {
              clientId: credentials?.Phone,
              clientSecret: credentials?.Pin,
            }
          );

          const accessToken = tokenResponse.data.content.accessToken; // Adjust according to the actual response structure

          // Step 2: Fetch user data using the access token
          const userResponse = await axios.get(
            "https://el2ka.vensta.ru/api/client/data",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const userData = userResponse.data.content; // Adjust according to the actual response structure
          console.log('userData from route', userData)

          // Step 3: Return the user data
          return userData;
        } catch (error) {
          // Handle errors from either request
          console.error("Authentication failed:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({token, user}) {
      if (user) token.user = user as unknown as IUser;
      return token
    },

    async session({token, session}) {
      session.user = token.user
      return session
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
