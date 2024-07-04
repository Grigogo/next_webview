import { IUser } from "@/lib/types";
import axios from "axios";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// Проверка наличия секретного ключа в переменных окружения
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please define the NEXTAUTH_SECRET environment variable inside .env.local");
}

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
          // Шаг 1: Получение токена доступа
          const tokenResponse = await axios.post(
            "https://el2ka.vensta.ru/api/oauth/token",
            {
              clientId: credentials?.Phone,
              clientSecret: credentials?.Pin,
            }
          );

          const accessToken = tokenResponse.data.content.accessToken; // Корректируйте в зависимости от структуры ответа

          // Шаг 2: Получение данных пользователя с использованием токена доступа
          const userResponse = await axios.get(
            "https://el2ka.vensta.ru/api/client/data",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const userData = userResponse.data.content; // Корректируйте в зависимости от структуры ответа
          console.log('userData from route', userData);

          // Шаг 3: Возврат данных пользователя
          return userData;
        } catch (error) {
          // Обработка ошибок
          console.error("Authentication failed:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as unknown as IUser;
      return token;
    },

    async session({ token, session }) {
      session.user = token.user;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
