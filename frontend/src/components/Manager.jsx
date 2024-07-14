import axios from "axios";
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import Footer from "../components/Footer";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const URL = import.meta.env.VITE_APP_BACKEND_URL


const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [isUpdate, setUpdate] = useState(false);
  const [itemId, setItemId] = useState(""); 
  const [passId, setPassId] = useState("")

  useEffect(() => {
    getDocs();
  }, []);

  const changePass = (id) => {
    id===passId ? setPassId("")  : setPassId(id)
    setTimeout(() => {
      setPassId("");
    }, 5000)
  }

  const getDocs = async () => {
    try {
      const response = await axios.get(
        `${URL}/api/document/getall`,
        {
          withCredentials: true,
        }
      );
      setPasswordArray(response.data);
    } catch (error) {
      console.log(error.message);
    }
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

  const updatePass = async () => {
    const { site, username, password } = form;
    try {
      await axios.put(
        `${URL}/api/document/update/${itemId}`,
        { site, username, password },
        { withCredentials: true }
      );
      setUpdate(false);
      setForm({ site: "", username: "", password: "" });
      getDocs();
      setItemId("");
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const savePassword = async () => {
    try {
      const { site, username, password } = form;
      const res = await axios.post(
        `${URL}/api/document/save`,
        { site, username, password },
        { withCredentials: true }
      );
      setForm({ ...form, site: "", username: "", password: "" });
      getDocs();
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    toast.success("Copied to clipboard", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigator.clipboard.writeText(text);
  };

  const deleteDoc = async (id) => {
    try {
      await axios.delete(
        `${URL}/api/document/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      getDocs();
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const updateDoc = async (id) => {
    const res = await axios.get(
      `${URL}/api/document/getdoc/${id}`,
      {
        withCredentials: true,
      }
    );

    const doc = res.data;
    setForm(doc);
    setUpdate(true);
    setItemId(id);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-yellow-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="p-2 md:p-0 md:mycontainer min-h-[84.90vh]">
        <h1 className="text-3xl text-bold text-center mb-4">
          Secret
          <span className="text-blue-700">Key</span>
        </h1>

        <p className="text-black text-center text-lg">
          Keep your secrets safe here
        </p>

        <div className="text-white flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Website Name"
            className="rounded-full border border-black w-full p-4 py-1 text-black"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Userame"
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
                placeholder="Password"
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

          <button
            onClick={isUpdate ? updatePass : savePassword}
            className="flex justify-center items-center gap-2 bg-yellow-400 rounded-full px-6 py-2 border border-black w-fit hover:bg-yellow-600 text-black"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            {isUpdate ? "Update" : "Save"}
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4 text-center">
            Your Passwords
          </h2>
          {passwordArray.length === 0 && (
            <div className="p-4 text-lg">No passwords to show</div>
          )}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-lg overflow-hidden mb-8">
              <thead className="bg-yellow-500">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-yellow-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className=" py-2 border-2 border-yellow-200 text-center w-32 ">
                        <div className=" flex items-center justify-center ">
                          <span>{item.site}</span>
                        </div>
                      </td>
                      <td className="py-2 border-2 border-yellow-200 text-center ">
                        <div className="flex items-center justify-center gap-[20px]">
                          <span>{item.username}</span>
                          <div
                            className="copy cursor-pointer"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <img src="/copy.png" width={15}></img>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border-2 border-yellow-200 text-center">
                        <div className="flex items-center justify-center gap-[20px]">
                          <span className="cursor-pointer" onClick={() => {changePass(item._id)}}>{passId===item._id ? item.password : "********"}</span>
                          <div
                            className="copy cursor-pointer"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <img src="/copy.png" width={15}></img>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border-2 border-yellow-200 text-center">
                        <span
                          className="cursor-pointer mx-2"
                          onClick={() => {
                            updateDoc(item._id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/lsrcesku.json"
                            trigger="hover"
                            stroke="bold"
                            colors="primary:#000000,secondary:#000000,tertiary:#242424,quaternary:#e8b730"
                            style={{ width: "23px", height: "23px" }}
                          ></lord-icon>
                        </span>
                        <span
                          className="cursor-pointer mx-2"
                          onClick={() => {
                            deleteDoc(item._id);
                          }}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/skkahier.json"
                            trigger="click"
                            style={{ width: "23px", height: "23px" }}
                          ></lord-icon>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Manager;
