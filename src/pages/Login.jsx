import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import backgroundVideo from "../assets/share.mp4";
import React from "react";
import { Navigate } from "react-router-dom";

const Login = () => (
  <>
    <SignedOut>
      <div className='w-screen h-screen flex items-center justify-center'>
        <video
          src={backgroundVideo}
          className='absolute left-0 top-0 w-screen h-screen object-cover '
          muted
          autoPlay
          loop
        />
        <div className='absolute left-0 top-0 w-screen h-screen object-cover bg-blackOverlay' />
        <SignIn afterSignInUrl='/' />
      </div>
    </SignedOut>
    <SignedIn>
      <Navigate to='/' />
    </SignedIn>
  </>
);

export default Login;
