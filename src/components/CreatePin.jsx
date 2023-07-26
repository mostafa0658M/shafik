import React, { useState } from "react";
import { AiOutlineCloudUpload, AiTwotoneDelete } from "react-icons/ai";
import { TextInput } from ".";
import { categories } from "../utils/data";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from ".";
import { Circles } from "react-loader-spinner";
import { client } from "../client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePin = ({ user }) => {
  const [fileReaderImageURL, setFileReaderImageURL] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleImageUpload = (e) => {
    e.preventDefault();
    const droppedFiles = e?.dataTransfer?.files;
    const reader = new FileReader();
    reader.onload = () => {
      setFileReaderImageURL(reader.result);
    };
    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        e?.target?.files[0]?.type || droppedFiles[0]?.type
      )
    ) {
      return;
    } else if (droppedFiles?.length > 0) {
      reader.readAsDataURL(droppedFiles[0]);
    } else if (e?.target?.files?.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const MAX_FILE_SIZE = 2000000;
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/svg",
  ];
  const schema = z.object({
    image: z
      .any()
      .refine((files) => files?.length > 0, "Please upload an image")
      .refine(
        (files) => files[0]?.size < MAX_FILE_SIZE,
        "Max Image Size is 20MB"
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
        "The image type should be SVG, PNG, JPG, JPEG only"
      ),
    title: z.string().min(3).max(30),
    destination: z.string().url(),
    category: z.string(),
    about: z.string().min(6).max(60),
  });
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data) => {
    setLoading(true);
    const image = await client.assets
      .upload("image", data.image[0])
      .catch(() => {
        toast.error("Failed to upload this image");
        setLoading(false);
      });

    if (image) {
      client
        .create({
          _type: "pin",
          ...data,
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: image._id },
          },
          userId: user?.id,
          postedBy: {
            _type: "postedBy",
            _ref: user?.id,
          },
        })
        .then(() => toast.success("Uploaded successfully"))
        .then(() => navigate("/"));
    }
    setLoading(false);
  };
  return (
    <div>
      {loading && (
        <div className='fixed w-full h-screen left-0 top-0 bg-whiteOverlay flex items-center flex-col justify-center gap-2 z-50'>
          <Circles color='red' />
          <p className='text-lg'>Uploading Your Pin...</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full items-center flex flex-col bg-blue-50 h-96 py-3 px-1 border border-blue-500 border-dashed rounded-xl justify-center relative'>
          {fileReaderImageURL ? (
            <div className='relative h-full'>
              <img
                src={fileReaderImageURL}
                alt='selected-image'
                className='h-full object-contain'
              />
              <button
                type='button'
                className='absolute bottom-2 right-2 p-3 bg-white text-red-500 opacity-80 hover:opacity-100 transition-smooth rounded-full cursor-pointer'
                onClick={() => setFileReaderImageURL()}
              >
                <AiTwotoneDelete />
              </button>
            </div>
          ) : (
            <label
              htmlFor='image-input'
              className='items-center justify-center flex flex-col cursor-pointer w-full h-full'
              onDrop={handleImageUpload}
              onDragEnter={(e) => e.preventDefault()}
              onDragOver={(e) => e.preventDefault()}
            >
              <AiOutlineCloudUpload fontSize={120} />
              <p className='text-center text-lg '>
                <b>Upload an image</b> or drag it right here (less than 20mb)
                <br />
                SVG, PNG, JPG, JPEG only
              </p>
            </label>
          )}
        </div>
        <input
          type='file'
          id='image-input'
          className='hidden'
          {...register("image", { onChange: (e) => handleImageUpload(e) })}
        />
        <ErrorMessage error={errors.image} />
        <TextInput title='title' register={register} error={errors.title} />
        <div className='flex flex-col md:flex-row gap-2 items-start'>
          <TextInput
            title='destination'
            register={register}
            error={errors.destination}
          />
          <div className='flex flex-col w-full mt-4'>
            <select
              className=' h-full outline-none bg-gray-50 border border-gray-200 rounded-md focus:border-blue-500 invalid:border-red-500 peer transition-smooth p-3 focus:shadow-md peer w-full'
              {...register("category")}
            >
              <option value='others'>Select Category</option>

              {categories.map((item) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
            <ErrorMessage error={errors.category} />
          </div>
        </div>
        <TextInput
          title='about'
          type='text-aria'
          register={register}
          error={errors.about}
        />
        <button
          type='submit'
          className='px-8 py-3 mt-5 rounded-full bg-red-500 disabled:bg-gray-500 disabled:cursor-[not-allowed] text-white font-medium text-center opacity-75 hover:opacity-100 transition-smooth w-full sm:w-fit'
          disabled={loading}
        >
          Save Pin
        </button>
      </form>
    </div>
  );
};

export default CreatePin;
