import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import { useUser } from "@clerk/clerk-react";
const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 4,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  const { user } = useUser();
  return (
    <Masonry className='flex' breakpointCols={breakpointObj}>
      {pins.map((pin) => (
        <Pin key={pin._id} pin={pin} user={user} />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
