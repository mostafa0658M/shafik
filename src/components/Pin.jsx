import React, { useState } from "react";
import { client, urlFor } from "../client";
import { MdDownload, MdFileDownload } from "react-icons/Md";
import { v4 as uuidv4 } from "uuid";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { AiFillHeart, AiTwotoneDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Pin = ({ pin, user }) => {
  const [alreadySaved, setAlreadySaved] = useState(
    !!pin?.save?.filter((item) => item?.postedBy?._id === user?.id).length
  );
  const navigate = useNavigate();
  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user.id,
            postedBy: {
              _type: "postedBy",
              _ref: user.id,
            },
          },
        ])
        .commit()
        .then(() => setAlreadySaved(true))
        .then(() =>
          toast.info("Saved successfully!", { icon: <AiFillHeart /> })
        )
        .catch(() => toast.error("Failed to save this pin"));
    }
  };
  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        toast.error("This pin will be deleted soon..", {
          icon: <AiTwotoneDelete />,
        });
      })
      .then(() => {
        setInterval(() => window.location.reload(), 2000);
      });
  };
  return (
    <div className='m-2'>
      <div
        onClick={() => navigate(`/pin-detail/${pin._id}`)}
        className='group relative overflow-hidden w-auto rounded-lg cursor-zoom-in hover:shadow-lg transition-all duration-500 ease-in-out'
      >
        {pin?.image && (
          <img
            className='w-full rounded-lg'
            src={urlFor(pin?.image).width(250).url()}
            alt='post-image'
          />
        )}
        <div className='absolute w-full h-full left-0 top-0 invisible opacity-0 group-hover:opacity-100 group-hover:visible flex flex-col justify-between p-2 z-50 transition-all transition-smooth'>
          <div className='flex flex-row justify-between'>
            <a
              href={`${pin?.image?.asset?.url}?dl=`}
              download
              onClick={(e) => {
                toast.info("Downloading the image..", {
                  icon: <MdDownload />,
                  hideProgressBar: false,
                });
                e.stopPropagation();
              }}
              className='rounded-full bg-white p-2 opacity-75 hover:opacity-100 transition-smooth hover:shadow-md'
            >
              <MdFileDownload />
            </a>
            {alreadySaved ? (
              <button
                type='button'
                disabled
                className='bg-gray-500 opacity-75 hover:opacity-100 px-5 py-1 rounded-3xl text-white text-base font-bold hover:shadow-md outline-none transition-smooth'
              >
                {pin?.save?.length || "1"} Saved
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  savePin(pin?._id);
                }}
                type='button'
                className='bg-red-500 opacity-75 hover:opacity-100 px-5 py-1 rounded-3xl text-white text-base font-bold hover:shadow-md outline-none transition-smooth'
              >
                Save
              </button>
            )}
          </div>
          <div className='flex flex-row justify-between items-center'>
            {pin?.destination && (
              <a
                href={pin?.destination}
                target='_blank'
                rel='noreferrer'
                onClick={(e) => e.stopPropagation()}
                className='flex flex-row gap-2 rounded-full bg-white items-center p-2 px-4 text-black font-bold opacity-75 hover:opacity-100 transition-smooth'
              >
                <BsFillArrowUpRightCircleFill />
                {pin?.destination?.length > 20
                  ? pin?.destination?.slice(8, 20) + "..."
                  : pin?.destination?.slice(8)}
              </a>
            )}
            {user?.id === pin?.postedBy?._id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(pin?._id);
                }}
                type='button'
                className='h-fit bg-white opacity-75 hover:opacity-100 p-2 rounded-3xl text-black hover:text-red-500 text-base font-bold hover:shadow-md outline-none transition-smooth'
              >
                <AiTwotoneDelete />
              </button>
            )}
          </div>
        </div>
      </div>
      <Link
        to={`/user-profile/${pin?.postedBy?._id}`}
        className='flex flex-row gap-2 items-center mt-2'
      >
        <img
          src={pin?.postedBy?.image}
          alt='profile-image'
          className='w-8 h-8 rounded-full'
        />
        <p className='font-semibold capitalize'>{pin?.postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
