import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { SideBar, UserProfile } from "../components";
import logo from "../assets/logo_with_name.png";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Pins } from ".";
import { client } from "../client";

const Home = () => {
  const navigate = useNavigate();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { user, isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn) {
      const doc = {
        _id: user.id,
        _type: "user",
        userName: user.username || user.fullName,
        image: user.imageUrl,
      };

      client.createIfNotExists(doc);
    } else if (isSignedIn != undefined) {
      console.log(isSignedIn);
      navigate("/login");
    }
  }, [isSignedIn]);

  return (
    <SignedIn>
      <div className=' bg-gray-50 flex flex-col md:flex-row h-screen'>
        <div className='hidden md:flex h-screen flex-initial'>
          <SideBar user={user && user} />
        </div>
        <div className='flex md:hidden flex-row'>
          <div className='w-full p-2 flex flex-row items-center justify-between shadow-md'>
            <HiMenu
              fontSize={40}
              className='cursor-pointer'
              onClick={() => setToggleSidebar(true)}
            />
            <Link to='/'>
              <img src={logo} alt='Logo' className='w-28' />
            </Link>
            <Link to={`user-profile/${user?.id}`}>
              <img
                src={user?.imageUrl}
                alt='user image'
                className='w-9 h-9 rounded-full'
              />
            </Link>
          </div>
        </div>
        {toggleSidebar && (
          <div className='w-4/5 bg-white fixed h-screen shadow-md overflow-y-auto z-10 animate-slide-in'>
            <div className='flex justify-end p-2 align-center absolute w-full'>
              <AiFillCloseCircle
                fontSize={30}
                className='cursor-pointer'
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <SideBar user={user && user} closeSidebar={setToggleSidebar} />
          </div>
        )}
        <Routes>
          <Route
            path='user-profile/:userId'
            element={<UserProfile localUser={user && user} />}
          />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </SignedIn>
  );
};

export default Home;
