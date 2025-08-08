import { NavLink } from 'react-router'

const MenuItem = ({ label, address, icon: Icon }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-2 my-5  transition-colors duration-300 transform  hover:bg-linear-65 from-pink-900 to-pink-700  hover:text-gray-100 ${isActive ? 'bg-pink-900 text-white hover:bg-linear-65 from-pink-900 to-pink-700  hover:text-gray-100' : 'text-gray-600'
        }`
      }
    >
      <Icon className='w-5 h-5' />

      <span className='mx-4 font-medium'>{label}</span>
    </NavLink>
  )
}

export default MenuItem