'use client'

import { Button, Link } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { FC } from 'react'

const SigninButton: FC = () => {
  const {data: session} = useSession()

  return (
    <div className='flex items-center gap-2'>
      {session && session.user ?
        <>
          <p>{session.user.client.name}</p>
          <Link className='text-sky-500 hover:text-sky-600 transition-colors' href={"/api/auth/signout"}>Выйти</Link>
        </> :
        <>
          <Button as={Link} href={"/api/auth/signin"}>Войти</Button>
          <Button as={Link} href={"/auth/signup"}>Регистрация</Button>
        </>
      }
    </div>
  )
}

export default SigninButton
