import React from "react";
import { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [localStorage.getItem("user")]);

  return (
    <div
      className="font-sans antialiased text-gray-900 leading-normal tracking-wider bg-cover"
    >
      <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
        {/* Main Column */}
        <div
          id="profile"
          className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-95 mx-6 lg:mx-0"
        >
          <div className="p-4 md:p-12 text-center lg:text-left">
            {/* Image for mobile view */}
            <div
              className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
              style={{ backgroundImage: "url('UserImage.jpg')" }}
            ></div>

            <h1 className="text-3xl font-bold pt-8 lg:pt-0">
              {user?.name ?? ""}
            </h1>
            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-blue-500 opacity-25"></div>

            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
              <svg
                className="h-4 fill-current pr-2"
                viewBox="0 0 24 24"
                
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4h16v16H4V4z"
                  stroke="#000"
                  stroke-width="2"
                  fill="none"
                />
                <path d="M8 10h8" stroke="#000" stroke-width="2" />
                <path d="M8 14h4" stroke="#000" stroke-width="2" />
                <path d="M16 12h4" stroke="#000" stroke-width="2" />
                <path d="M16 16h4" stroke="#000" stroke-width="2" />
              </svg>
              User Review:
            </p>

            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
              <svg
                className="h-4 fill-current pr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 12 7 12s7-6.75 7-12c0-3.86-3.14-7-7-7zm0 15.75s-5.25-6.26-5.25-10.75c0-2.9 2.35-5.25 5.25-5.25s5.25 2.35 5.25 5.25c0 4.49-5.25 10.75-5.25 10.75z"
                  fill="#000"
                />
                <path
                  d="M9 9.75L12 6.75l3 3v3h-1.5v-1.5H10.5V12.75H9V9.75z"
                  fill="#000"
                />
              </svg>
              Saved Address:
            </p>

            <p className="pt-8 text-sm">Any additional information</p>

            <div className="pt-12 pb-8">
              <button className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-2/5">
          <img
            src="UserImage.jpg"
            className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
            alt="profile"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
