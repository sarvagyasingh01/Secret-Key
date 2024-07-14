import React from "react";
import { useRef, useState } from "react";
import { useEffect } from "react";
import Navbar from "./Navbar";
import F2 from "./F2";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Gbutton from "./Gbutton";
export const URL = import.meta.env.VITE_APP_BACKEND_URL

const Login = () => {
  const navigate = useNavigate();
  const ref = useRef();
  const passwordRef = useRef();
  const initialState = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState(initialState);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showPassword = () => {
    passwordRef.current.type = "text";
    if (ref.current.src.includes("/show.png")) {
      ref.current.src = "/hidden.png";
      passwordRef.current.type = "text";
    } else {
      ref.current.src = "/show.png";
      passwordRef.current.type = "password";
    }
  };

  const userLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      return toast.error("Fill all the fields");
    }

    //Login User
    try {
      const res = await axios.post(`${URL}/api/users/login`, {
        email,
        password,
      }, {withCredentials: true});      
      navigate("/");
      navigate(0)
      console.log(res.data);
    } catch (error) {
      toast.error(error.response.data.message); 
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar loggedIn={false} />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-yellow-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="p-2 md:mycontainer">
        <h1 className="text-4xl text-bold text-center mb-4">
          <span className="text-blue-700">Welcome</span>
        </h1>
        <p className="text-black text-center text-lg">Login to continue</p>
      </div>
      <div className=" flex flex-col p-4 text-black gap-8 items-center ">
      {/* mb-[208px] */}
      <div className="flex w-[250px] justify-between gap-8 mr-3 ">
        <div className="relative">
        <input
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="rounded-full border border-black w-[300px] p-4 py-1 text-black "
          type="text"
          name="email"
          id="email"
        />
        </div>
        </div>
        <div className="flex w-[250px] justify-between ml-5 gap-8">
          <div className="relative">
            <input
              ref={passwordRef}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="rounded-full border border-black w-[250px] p-4 py-1 text-black "
              type="password"
              name="password"
              id="password"
            />
            <span
              className="absolute right-[4px] top-[4px] text-black cursor-pointer"
              onClick={showPassword}
            >
              <img ref={ref} className="p-1" width={26} src="/show.png"></img>
            </span>
          </div>
        </div>

        <button
          onClick={userLogin}
          className="flex justify-center items-center gap-2 bg-yellow-400 rounded-full px-6 py-2 border border-black w-fit hover:bg-yellow-600 text-black"
        >
          <img className="p-1" width={34} src="/login.png"></img>
          Login
        </button>
      </div>
      <div className="text-center text-sm mb-4">
        Or
      </div>
      <Gbutton isLogin={true}/>
      <div className="text-center text-sm m-4">
        Don't have an account?{" "}
        <span className="cursor-pointer text-bold text-blue-600 hover:underline">
          <Link to="/register">SignUp</Link>
        </span>
      </div>
      <F2/>
    </>
  );
};

export default Login;
