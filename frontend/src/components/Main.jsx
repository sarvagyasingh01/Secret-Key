import React from "react";
import Navbar from "./Navbar";
import Manager from "./Manager";
import Footer from "./Footer";

const Main = () => {
  return (
    <>
      <Navbar loggedIn={true}/>
      <Manager/>
      <Footer/>
    </>
  );
};

export default Main;
