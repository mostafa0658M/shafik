import React, { useEffect, useRef, useState } from "react";
import { MdDownload, MdFileDownload } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { client } from "../client";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import { Spinner, MasonryLayout } from ".";
import { v4 as uuidv4 } from "uuid";

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pinDetail, setPinDetail] = useState();
  const [postingComment, setPostingComment] = useState(false);
  const [comment, setComment] = useState("");
  const [pinComments, setPinComments] = useState([]);
  const [pins, setPins] = useState();
  const scrollRef = useRef();

  const navigate = useNavigate();
  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);
    if (query) {
      setPinDetail("");
      client
        .fetch(query)
        .then((data) => {
          if (data[0]) {
            const query1 = pinDetailMorePinQuery(data[0]);
            client.fetch(query1).then((data) => setPins(data));
            setPinDetail(data[0]);
            setPinComments(data[0]?.comments || []);
          } else {
            toast.error("The pin not found!");
            navigate("/");
          }
        })
        .catch(() => {
          toast.error("Unknown error while loading the pin!");
          navigate("/");
        });
    }
  };
  const addComment = (e) => {
    e.preventDefault();
    setPostingComment(true);
    const commentData = {
      _key: uuidv4(),
      comment,
      postedBy: { _type: "reference", _ref: user?.id },
    };
    client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .insert("before", "comments[0]", [commentData])
      .commit()
      .then(() => {
        setPinComments((v) => [
          {
            comment,
            postedBy: {
              image: user.imageUrl,
              userName: user.userName || user.fullName,
            },
          },
          ...v,
        ]);
        setComment("");
        setPostingComment(false);
        scrollRef.current.scrollTo(0, 0);
      });
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message='Preparing pin details' />;

  return (
    <div className='w-full mx-auto max-w-[1000px] flex flex-col'>
      <img
        src={pinDetail?.image?.asset?.url}
        alt='pin-image'
        className='w-full rounded-t-3xl rounded-b-lg max-h-[600px] object-contain'
      />

      <div className='flex flex-col p-5 gap-2'>
        <div className='flex flex-row items-center justify-between'>
          <a
            href={`${pinDetail?.image?.asset?.url}?dl=`}
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
          <a
            href={pinDetail?.destination}
            target='_blank'
            rel='noreferrer'
            className='flex flex-row gap-2 rounded-full items-center text-black font-bold opacity-75 hover:opacity-100 transition-smooth justify-between'
          >
            {pinDetail?.destination?.length > 40
              ? pinDetail?.destination?.slice(8, 40) + "..."
              : pinDetail?.destination?.slice(8)}
          </a>
        </div>
        <Link
          to={`/user-profile/${pinDetail?.postedBy?._id}`}
          className='flex flex-row gap-2 items-center mt-2'
        >
          <img
            src={pinDetail?.postedBy?.image}
            alt='profile-image'
            className='w-6 h-6 rounded-full'
          />
          <p className='font-medium capitalize text-sm'>
            {pinDetail?.postedBy?.userName}
          </p>
        </Link>
        <p className='font-bold text-3xl'>{pinDetail?.title}</p>
        <p className='text-base'>{pinDetail?.about}</p>
      </div>
      <div className='flex flex-col px-5'>
        <span className='text-xl'>Comments:</span>
        <div
          className='flex flex-col gap-3 pt-5 max-h-370 overflow-y-auto'
          ref={scrollRef}
        >
          {pinComments?.map((item) => (
            <div className='flex flex-row gap-2 items-center'>
              <img
                src={item?.postedBy?.image}
                alt='profile-image'
                className='w-8 h-8 rounded-full'
              />
              <div className='flex flex-col'>
                <p className='font-semibold capitalize'>
                  {item?.postedBy?.userName}
                </p>
                <p>{item?.comment}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={addComment}
          className='flex flex-row mt-6 gap-2 items-center'
        >
          <img
            src={user?.imageUrl}
            alt='profile-image'
            className='w-8 h-8 rounded-full'
          />
          <input
            type='text'
            placeholder='Add a comment'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className='px-3 py-2 rounded-full outline-none border border-gray-200 w-full'
          />
          <button
            type='submit'
            className='px-5 py-2 rounded-full bg-red-500 disabled:bg-gray-500 disabled:cursor-[not-allowed] text-white font-medium text-center opacity-75 hover:opacity-100 transition-smooth w-fit'
            disabled={!comment || postingComment}
          >
            Post
          </button>
        </form>
      </div>
      {pins?.length > 0 ? (
        <div className='mt-6'>
          <h3 className='text-2xl font-bold w-full text-center'>
            More like this
          </h3>
          <MasonryLayout pins={pins} />
        </div>
      ) : (
        !pins && <Spinner message='Loading more pins like this' />
      )}
    </div>
  );
};

export default PinDetail;
