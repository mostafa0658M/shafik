import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo_with_name.png";
import { RiHomeFill } from "react-icons/ri";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { AiOutlineLogout } from "react-icons/ai";
import { categories } from "../utils/data";

const SideBar = ({ closeSidebar, user }) => {
  const { signOut } = useAuth();
  const handleSignOut = () => {
    toast.success("Signed Out successfully!");
    signOut();
  };
  const handleCloseSidebar = () => {
    if (closeSidebar) closeSidebar(false);
  };
  const isActiveStyle =
    "flex flex-row gap-3 px-5 items-center font-bold border-r-2 border-black transition-all duration-200 ease-in-out";
  const isNotActiveStyle =
    "flex flex-row gap-3 px-5 items-center text-gray-500 hover:text-black transition-all duration-200 ease-in-out";

  return (
    <div className='overflow-y-hidden flex flex-col justify-between h-full bg-white overflow-y-auto hide-scrollbar min-w-210'>
      <div className='flex flex-col overflow-y-auto'>
        <Link
          to='/'
          className='flex px-5 gap-2 my-6 pt-1 z-20 w-190 items-center'
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt='[=] Shafik' className='w-full' />
        </Link>
        <div className='flex flex-col gap-5'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>
            Discover Categories
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
            >
              <img
                src={category.image}
                alt='category'
                className='w-8 h-8 rounded-full'
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className='flex flex-col mx-3 mt-5 mb-3 gap-2'>
        <button
          className='cursor-pointer flex flex-row items-center p-2 rounded-lg bg-white shadow-lg gap-2'
          onClick={handleSignOut}
        >
          <div className='p-2 text-lg  text-red-500 rounded-full'>
            <AiOutlineLogout />
          </div>
          <p className=' whitespace-nowrap'>Sign Out</p>
        </button>

        <Link
          to={`/user-profile/${user.id}`}
          className='flex flex-row items-center p-2 rounded-lg bg-white shadow-lg gap-2'
          onClick={handleCloseSidebar}
        >
          <img
            src={user.imageUrl}
            alt='user-image'
            className='w-10 h-10 rounded-full'
          />
          <p className=' whitespace-nowrap'>{user.userName || user.fullName}</p>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
