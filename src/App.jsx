import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={key} navigate={navigate}>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='/*' element={<Home />} />
      </Routes>
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeOnClick
        rtl={false}
        draggable
        theme='colored'
        limit={6}
      />
    </ClerkProvider>
  );
}

export default App;
