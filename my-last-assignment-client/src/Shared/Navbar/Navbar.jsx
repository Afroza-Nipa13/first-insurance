import { FaHome, FaClipboardList, FaBlog, FaQuestionCircle, FaTachometerAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useState } from 'react'
import { Link } from 'react-router'
import avatarImg from '../../assets/placeholder.jpg'
import Container from '../Container'
import useAuth from '../../Hooks/useAuth'
import Logo from '../Logo/Logo'
const Navbar = () => {
  const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='fixed w-full mx-auto bg-white/50 backdrop-blur-md top-0 left-0 z-50 shadow-sm'>
      <div className='md:py-3 border-gray-200 border-b-[1px]'>
        <Container>
          <div className='flex flex-row  items-center justify-between gap-3 md:gap-0'>
            {/* Logo */}
            <Logo></Logo>

            <div className='hidden lg:block'>
              <ul className='flex gap-4 items-center'>
                <Link to='/' className='flex items-center gap-2 px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'>
                  <FaHome /> Home
                </Link>

                <Link to='/all-policies' className='flex items-center gap-2 px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'>
                  <FaClipboardList /> All Policies
                </Link>

                <Link to='/blogs' className='flex items-center gap-2 px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'>
                  <FaBlog /> Blogs
                </Link>

                <Link to='/faqs' className='flex items-center gap-2 px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'>
                  <FaQuestionCircle /> FAQs
                </Link>

                {user && (
                  <Link to='/dashboard' className='flex items-center gap-2 px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'>
                    <FaTachometerAlt /> Dashboard
                  </Link>
                )}
              </ul>
            </div>
            {/* Dropdown Menu */}
            {user ?

              <>
                <div className='relative'>
                  <div className='flex flex-row items-center gap-3'>
                    {/* Dropdown btn */}
                    <div
                      onClick={() => setIsOpen(!isOpen)}
                      className='md:p-1 p-0 m-2 md:m-0 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
                    >

                      <input
                          type="checkbox"
                          value="forest"
                          className="toggle theme-controller" />

                      <div className=' md:block'>
                        
                        {/* Avatar */}
                        <img
                          className='rounded-full'
                          referrerPolicy='no-referrer'
                          src={user && user.photoURL ? user.photoURL : avatarImg}
                          alt='profile'
                          height='50'
                          width='50'
                        />
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className='absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm'>
                      <div className='flex flex-col cursor-pointer'>
                        <Link
                          to='/'
                          className='block md:hidden px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                        >
                          Home
                        </Link>
                        <Link
                          to='/blogs'
                          className='block md:hidden px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                        >
                          Blogs
                        </Link>
                        <Link
                          to='/all-policies'
                          className='block md:hidden px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                        >
                          All Policies
                        </Link>
                        <Link
                          to='/faqs'
                          className='block md:hidden px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                        >
                          FAQs
                        </Link>

                        {user ? (
                          <>
                            <Link
                              to='/dashboard'
                              className='px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                            >
                              Dashboard
                            </Link>
                            <div
                              onClick={logOut}
                              className='px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold cursor-pointer'
                            >
                              Logout
                            </div>
                          </>
                        ) : (
                          <>
                            <Link
                              to='/login'
                              className='px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                            >
                              Login
                            </Link>
                            <Link
                              to='/register'
                              className='px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                            >
                              Register
                            </Link>
                          </>
                        )}

                       
                      </div>
                    </div>
                  )}
                </div>
              </>



              :



              <>
                <div className=''>
                  <div className='flex flex-row items-center gap-3'>
                     <input
                          type="checkbox"
                          value="forest"
                          className="toggle theme-controller" />
                    {/* Right side links */}
                    <>
                      <Link
                        to='/login'
                        className='flex items-center gap-2 px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                      >
                        <FaSignInAlt /> Login
                      </Link>

                      <Link
                        to='/register'
                        className='flex items-center gap-2 px-4 py-3 hover:bg-primary hover:text-white rounded-lg transition font-semibold'
                      >
                        <FaUserPlus /> Register
                      </Link>
                    </>

                  </div>


                </div>
              </>}


          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar
