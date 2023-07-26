import React, { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CreatePin, Feed, NavBar, PinDetail, Search } from "../components";

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef();
  const location = useLocation();
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, [location]);
  return (
    <div className='px-2 md:px-5 w-full h-full overflow-y-auto' ref={scrollRef}>
      <div className='bg-gray-50'>
        <NavBar
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <div className='h-fit pb-5'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/category/:categoryId' element={<Feed />} />
          <Route
            path='/pin-detail/:pinId'
            element={<PinDetail user={user && user} />}
          />
          <Route
            path='/create-pin'
            element={<CreatePin user={user && user} />}
          />
          <Route
            path='/search'
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
