import React, { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, user } = useAuth()
  const { register, handleSubmit,
    formState: { errors } } = useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location?.state?.from?.pathname || '/'
  if (user) return <Navigate to={from} replace={true} />
 
  // if(loading) return <LoadingSpinner></LoadingSpinner>

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const onSubmit = data => {
    console.log(data)

    signIn(data.email, data.password).then(result => {
      console.log(result)

      // save user data in database

      navigate(from, { replace: true })
      toast.success('User logged in successfully')

    }).catch(error => {
      console.log(error.message)
      toast.error(error.message)
    })

  }
  return (

    <div>
      <Helmet>
        <title>Login | FIRST Life Insurance</title>
      </Helmet>
      <div className='max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl text-primary font-bold'><span className='text-gray-600'> Welcome</span> Back!</h1>
          <p className='text-sm text-gray-400'>
            Sign in to access your account
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate=''
          action=''
          className='space-y-6 ng-untouched ng-pristine ng-valid'
        >
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>
                Email address
              </label>
              <input
                type='email'
                {...register('email')}
                name='email'
                id='email'
                required
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-[#851143] bg-gray-200 text-gray-900'
                data-temp-mail-org='0'
              />
            </div>
            <div>
              <div className='relative'>
                <label className="block text-sm font-medium mb-1">Password</label>
              </div>
              <div>
                <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                name='password'
                autoComplete='current-password'
                minLength={6}
                id='password'
                required={true}
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-[#851143] bg-gray-200 text-gray-900'
              />
               {/* Eye icon */}
                            {/* <span
                              onClick={togglePasswordVisibility}
                              className="absolute top-10 right-3 cursor-pointer text-gray-600"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span> */}
              </div>
              
                           
                {errors.password?.type === 'required' && <span className='text-red-600'>Password is required</span>}
              {errors.password?.type === 'minLength' && <span className='text-red-600'>Password must be 6 character or more..</span>}
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='bg-primary w-full rounded-md py-3 text-white'
            >

              Continue

            </button>
          </div>
        </form>
        <div className='space-y-1'>
          <button className='text-xs hover:underline hover:text-primary text-gray-400'>
            Forgot password?
          </button>
        </div>
        <div className='flex items-center pt-4 space-x-1'>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
          <p className='px-3 text-sm dark:text-gray-400'>
            Login with social accounts
          </p>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
        </div>
        <div>
          <SocialLogin></SocialLogin>
        </div>

        <p className='px-6 text-sm text-center text-gray-400'>
          Don&apos;t have an account yet?{' '}
          <Link
            to='/register'
            className='hover:underline hover:text-[#851143] text-gray-600'
          >
            Register Here.
          </Link>
          .
        </p>
      </div>
    </div>

  );
};

export default Login;