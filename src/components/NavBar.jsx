import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const NavBar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex items-center justify-start bg-white w-full rounded-lg p-2 gap-2'>
        <IoMdSearch fontSize={21} />
        <input
          type='text'
          placeholder='Search'
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          onFocus={() => navigate("/search")}
          className='w-full outline-none'
        />
      </div>
      <div className='flex gap-3'>
        <Link to={`user-profile/${user.id}`} className='hidden md:block'>
          <img
            src={user.imageUrl}
            alt='User Image'
            className='w-12 max-w-fit h-12 rounded-lg'
          />
        </Link>
        <Link to='create-pin'>
          <div className='flex items-center justify-center w-12 h-12 bg-black text-white rounded-lg'>
            <IoMdAdd fontSize={21} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
