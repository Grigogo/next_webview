import SignUpForm from '@/components/SignUpForm'
import { Image, Link } from '@nextui-org/react'
import { FC } from 'react'

const page: FC = () => {
  return (
    <div className='flex justify-center items-center gap-3 flex-col pt-4'>
      <div className='mb-8 mt-4 text-6xl'>Войти</div>
      <SignUpForm />
      <div className='md:col-span-2 flex justify-center items-center'>
        <p className='text-center p-2'>Уже зарегистрированы?</p>
        <Link href={"/auth/signin"}>Войти</Link>
      </div>
    </div>
  )
}

export default page
