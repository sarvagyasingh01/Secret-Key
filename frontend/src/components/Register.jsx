import React from "react";
import { useRef, useState } from "react";
import Navbar from "./Navbar";
import F2 from "./F2"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Gbutton from "./Gbutton";
export const URL = import.meta.env.VITE_APP_BACKEND_URL

const Register = () => {
  const navigate = useNavigate();
  const initialState = {
    email: "",
    username: "",
    password: ""
  }
  const ref = useRef();
  const passwordRef = useRef();
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

  const signUp = async() => {
    const {email, username, password} = form
    
    if(!email || !username || !password){
      return toast.error("Fill all fields")
    }

    if(password.length<6){
      return toast.error("Password can not be less than 6 characters")
    }

    if(!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      return toast.error("Enter a valid email")
    }

    //Register User
    try {
      const res = await axios.post(`${URL}/api/users/register`, {email, username, password}, {withCredentials: true});
      setForm({...form, email: "", username: "", password: ""})
      navigate("/")
      navigate(0)
      toast.success("User Registered Successfully")
    } catch (error) {
      toast.error(error.response.data.message)
    }
    
  };

  return (
    <>
      <ToastContainer/>
      <Navbar loggedIn={false} />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-yellow-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="md:mycontainer">
        <h1 className="text-4xl text-bold text-center mb-4">
          <span className="text-blue-700">Welcome</span>
        </h1>
        <p className="text-black text-center text-lg">Sign Up to continue</p>
      </div>
      <div className="text-white flex flex-col p-4 text-black gap-8 items-center">
        <input
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="rounded-full border border-black w-full p-4 py-1 text-black"
          type="text"
          name="email"
          id="email"
        />
        <div className="flex flex-col md:flex-row w-full justify-between gap-8">
          <input
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="rounded-full border border-black w-full p-4 py-1 text-black"
            type="text"
            name="username"
            id="username"
          />
          <div className="relative">
            <input
              ref={passwordRef}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="rounded-full border border-black w-full p-4 py-1 text-black"
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

        <button className="flex justify-center items-center gap-2 bg-yellow-400 rounded-full px-6 py-2 border border-black w-fit hover:bg-yellow-600 text-black" onClick={signUp}>
          <lord-icon
            src="https://cdn.lordicon.com/jgnvfzqg.json"
            trigger="hover"
          ></lord-icon>
          Sign Up
        </button>
      </div>
      <div className="text-center text-sm mb-2">
        Or
      </div>
      <Gbutton isLogin={false}/>
      <div className="text-center text-sm m-4">
        Already have an account?{" "}
        <span className="cursor-pointer text-bold text-blue-600 hover:underline">
          <Link to="/login">Login</Link>
        </span>
      </div>
      <F2/>
    </>
  );
};

export default Register;
