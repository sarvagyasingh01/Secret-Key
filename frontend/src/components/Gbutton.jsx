import React from "react";
export const URL = import.meta.env.VITE_APP_BACKEND_URL

const Gbutton = () => {
  const googleLogin = () => {
    window.open(`${URL}/auth/google`, '_self');
  };
  return (
    <div className="flex justify-center">
      <span className="bg-blue-200 px-2 py-1 rounded-full border border-black w-fit  hover:bg-blue-400">      
          <button onClick={googleLogin} className="p-2 flex justify-items items-center gap-2">
            <p>Google</p>
            <img width={20} src="google.png"></img>
          </button>
      </span>
    </div>
  );
};

export default Gbutton;
