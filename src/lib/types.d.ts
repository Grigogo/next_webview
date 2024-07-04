import { User } from next-auth;

interface IClient {
  amounts: number[]
  balance: number
  name: string
  phone: string
  bonus: number
  bonusPercent: number
}

interface IcarWashes {

}

interface IUser {
  client: IClient
}

declare module "next-auth" {
  interface Session {
    user: IUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: IUser
  }
}
