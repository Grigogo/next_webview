import axios from "axios";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        Phone: {
          label: "Номер телефона",
          type: 'text',
          placeholder: "Ваш номер"
        },
        Pin: {
          label: "Пароль",
          type: 'password',
          placeholder: "Пин"
        }
      },

      async authorize(credentials) {
        const userToken = await axios.post('https://el2ka.vensta.ru/api/oauth/token', {
          clientId: credentials?.Phone,
          clientSecret: credentials?.Pin,
        })

        return userToken.data.content.accessToken;
      }
    })
  ]
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
