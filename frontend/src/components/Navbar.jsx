import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const URL = import.meta.env.VITE_APP_BACKEND_URL

const Navbar = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { loggedIn } = props;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logOut = async () => {
    try {
      await axios.get(`${URL}/api/users/logout`, {
        withCredentials: true,
      });
      // navigate("/logout");
      // navigate(0);
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };


  const deleteUser = async () => {
    const userInput = prompt(
      'Deleting your account will delete all your saved data and information. Type "yes" to continue or "no" cancel...'
    );
    if (userInput !== null) {
      const response = userInput.toLowerCase().trim();
      if (response === "yes" || response === "no") {
        if (response === "yes") {
          try {
            await axios.delete(`${URL}/document/deleteall`, {
              withCredentials: true,
            });
            await axios.delete(`${URL}/api/users/delete`, {
              withCredentials: true,
            });
            await axios.get(`${URL}/api/users/logout`, {
              withCredentials: true,
            });
            // navigate("/logout");
            // navigate(0);
            toast.success("Account deleted successfully!");
          } catch (error) {
            toast.error(error.response.data.message)
          }
        } else {
          toast.info("Cancelled");
        }
      } else {
        toast.error("Invalid input");
      }
    } else {
      toast.error("Invalid input");
    }
  };

  return (
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer flex justify-between items-center px-6 h-14 py-5">
        <div className="logo font-bold text-white text-lg">
          Secret
          <span className="text-blue-600">Key</span>
        </div>
        <div className="flex justify-items items-center gap-6 text-base ">
          <button className="px-2 py-2 rounded-md" href="#">
            <img src="/github.svg" alt="Github" className="h-[44px] w-[44px]" />
          </button>
          {loggedIn && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center px-2 py-1 rounded-md"
              >
                <img src="/menu.png" alt="Dropdown Icon" className="h-7 w-7" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white  text-black rounded-md shadow-lg">
                  <a
                    onClick={logOut}
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md"
                    href="#"
                  >
                    Logout
                  </a>
                  <div className="border-t border-slate-700"></div>
                  <a
                    onClick={deleteUser}
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-md"
                    href="#"
                  >
                    Delete Account
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
