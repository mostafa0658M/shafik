import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, MasonryLayout } from ".";
import { client } from "../client";
import {
  userQuery,
  userCreatedPinsQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const isActiveStyle =
  "bg-red-500 text-white rounded-full px-3 py-2 cursor-pointer font-bold transition-smooth";
const isNotActiveStyle = "px-3 py-2 cursor-pointer font-bold transition-smooth";

const UserProfile = ({ localUser }) => {
  const { userId } = useParams();
  const [user, setUser] = useState();
  const [selectedCategory, setSelectedCategory] = useState("created");
  const [pins, setPins] = useState();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = () => {
    toast.success("Signed Out successfully!");
    signOut();
  };
  useEffect(() => {
    const query = userQuery(userId);
    client
      .fetch(query)
      .then((data) => {
        if (data[0]) {
          setUser(data[0]);
        } else {
          toast.error("User is not defined!");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Unknown error!");
        navigate("/");
      });
  }, [userId]);
  useEffect(() => {
    setPins();
    if (selectedCategory == "created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery).then(setPins);
    } else if (selectedCategory == "saved") {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then(setPins);
    }
  }, [userId, selectedCategory]);

  if (!user) return <Spinner message='Prepare profile data...' />;
  return (
    <div className='w-full flex flex-col pb-5 overflow-y-auto'>
      <div className='relative flex flex-col w-full items-center'>
        <img
          src='https://source.unsplash.com/1600x900/?nature,photography,technology'
          alt='profile-background'
          className='w-full h-340 sm:h-420 object-cover bg-gradient-to-r from-orange-500 to-red-500'
        />
        <img
          src={user?.image}
          alt='profile-image'
          className='w-28 h-28 rounded-full border border-white shadow-lg -mt-12'
        />
        <p className='font-bold text-3xl capitalize mt-3'>{user.userName}</p>
        {localUser.id == user._id && (
          <button
            className='absolute top-3 right-3 p-2 text-lg bg-white shadow-lg text-red-500 rounded-full cursor-pointer'
            onClick={handleSignOut}
          >
            <AiOutlineLogout />
          </button>
        )}
      </div>
      <div className='flex flex-row gap-3 justify-center mt-2 mb-5'>
        <button
          className={
            selectedCategory == "created" ? isActiveStyle : isNotActiveStyle
          }
          onClick={() => setSelectedCategory("created")}
        >
          Created
        </button>
        <button
          className={
            selectedCategory == "saved" ? isActiveStyle : isNotActiveStyle
          }
          onClick={() => setSelectedCategory("saved")}
        >
          Saved
        </button>
      </div>
      <div className='w-full'>
        {pins?.length == 0 ? (
          <p className='text-center py-5'>
            there isn't {selectedCategory} pins
          </p>
        ) : pins ? (
          <MasonryLayout pins={pins} />
        ) : (
          <Spinner message={`Loading ${selectedCategory} pins..`} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
