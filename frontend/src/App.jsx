import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Main from "./components/Main";
import Manager from "./components/Manager";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import axios from "axios";
import { navigate, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
export const URL = import.meta.env.VITE_APP_BACKEND_URL

function App() {

  const [isAuth, setAuth] = useState(false)
  
  
  useEffect(() => {
    axios.get(`${URL}/api/users/loggedin`, {withCredentials: true})
    .then(res => {
      setAuth(res.data)
    })
    .catch(() =>{
      setAuth(false)
    })
  }, [isAuth])

  

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuth ? <Dashboard /> :  <Navigate to="/login" />} />
        <Route path="/login" element={isAuth ?  <Navigate to="/" /> : <Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/register" element={isAuth ?   <Navigate to="/" /> : <Register />} />
      </Routes>
    </Router>
  );
}

export default App;
