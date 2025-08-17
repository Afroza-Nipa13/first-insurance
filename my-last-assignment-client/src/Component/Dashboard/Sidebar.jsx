import { useState } from 'react'
import { GrLogout } from 'react-icons/gr'
import { FcSettings } from 'react-icons/fc'
import { AiOutlineBars } from 'react-icons/ai'
import MenuItem from './MenuItem'
import CustomerMenu from './CustomerMenu/CustomerMenu'
import { Link } from 'react-router'
import logo from '../../assets/logo.png'
import useAuth from '../../Hooks/useAuth'
import AdminMenu from './AdminMenu/AdminMenu'
import AgentMenu from './AgentMenu/AgentMenu'
import useRole from '../../Hooks/useRole'
import LoadingSpinner from '../../Shared/LoadingSpinner'
import { FaHome } from 'react-icons/fa'
const Sidebar = () => {
  const { logOut, user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const { role, roleLoading } = useRole();
  if (roleLoading) return <LoadingSpinner></LoadingSpinner>;


  console.log('user and user role from sidebar', user, role)


  // Sidebar Responsive Handler
  const handleToggle = () => {
    setIsActive(!isActive)
  }

  return (
    <>

      {/* Small Screen Navbar */}
      <div className=' text-primary flex shadow-2xl justify-between md:hidden items-center px-4 py-2'>
        <div className='cursor-pointer font-bold'>
          <Link to='/'>
            <img
              src={logo}
              alt='logo'
              width='100'
              height='100'
            />
          </Link>
        </div>

        {/* Profile Picture or Menu Icon */}
        {user?.photoURL ? (
          <div className='flex justify-center gap-2'>
          <input
              type="checkbox"
              value="forest"
              className="toggle theme-controller my-1" />
          <button onClick={handleToggle} className='focus:outline-none'>

            <img
              src={user.photoURL}
              alt='profile'
              className='w-8 h-8 rounded-full border border-primary'
            />
          </button>
          </div>
        ) : (
          <>
            <input
              type="checkbox"
              value="forest"
              className="toggle theme-controller" />
            <button
              onClick={handleToggle}
              className='mobile-menu-button focus:outline-none focus:bg-gray-200 p-2'
            >
              <AiOutlineBars className='h-5 w-5' />
            </button>
          </>

        )}
      </div>


      {/* Sidebar */}
      <div
        className={`w-70 z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-linear-to-t from-sky-100 to-indigo-200 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${isActive && '-translate-x-full'
          }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div>
          <div>
            <div className='w-full hidden md:flex px-5 py-3 rounded-lg justify-center items-center mx-auto'>
              <Link to='/'>
                <img
                  // className='hidden md:block'
                  src={logo}
                  alt='logo'
                  width='150'
                  height='150'
                />
              </Link>
            </div>
            <hr className='text-gray-200 shadow-xl' />
          </div>

          {/* Nav Items */}
          <div className='flex flex-col justify-between flex-1 mt-6'>
            <nav>
              <MenuItem
                icon={FaHome}
                label="Dashboard Home"
                address="/dashboard"
              />

              {/*  Menu Items */}
              {role === 'admin' && <AdminMenu></AdminMenu>}

              {role === 'customer' && <CustomerMenu></CustomerMenu>}
              {role === 'agent' && <AgentMenu />}

            </nav>
          </div>
        </div>

        <div>
          <hr className='text-gray-100 shadow-2xl' />

          <MenuItem
            icon={FcSettings}
            label='Profile'
            address='/dashboard/profilePage'
          />
          <button
            onClick={logOut}
            className='flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-linear-65 from-pink-900 to-pink-700  hover:text-gray-100 transition-colors duration-300 transform'
          >
            <GrLogout className='w-5 h-5' />

            <span className='mx-4 font-medium'>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar