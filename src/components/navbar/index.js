import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { NavLink , Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const navLinks = [
    { href: "/home", label: "Home", enabled: true },
    { href: "/profile", label: "Profile", enabled: userLoggedIn },
    { href: "/orders", label: "Orders", enabled: userLoggedIn },
  ];
  return (
    <>
      <header className="sm:px-8 px-4 py-3 z-10 w-full shadow-xl">
        <nav className="flex justify-between items-center max-container">
          <Link to="/" className="text-3xl font-bold" >
            <img src="SB-logo.jpg" className="w-16 h-16"/>
          </Link>
          <ul className="flex-1 flex justify-end items-center gap-16 max-lg:hidden px-16 ">
            {navLinks.map((item) =>
              item.enabled ? (
                <li key={item.label} className="">
                  <Link to={item.href} className=" py-2 px-5 border border-gray-100 bg-gray-50 rounded-md hover:bg-black hover:text-white  transition-all ">{item.label}</Link>
                </li>
              ) : (
                <></>
              )
            )}
            {/* <li className="flex gap-2 text-lg leading-normal font-medium font-montserrat max-lg:hidden wide:mr-24">
              {userLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>
                </>
              ) : (
                <></>
              )}
            </li> */}
          </ul>

          <div className="flex gap-2 text-lg leading-normal font-medium font-montserrat max-lg:hidden wide:mr-24">
            {userLoggedIn ? (
              <>
                <button className="py-2 px-5 bg-black text-white rounded shadow-lg hover:scale-105 transition-all"
                  onClick={() => {
                    doSignOut().then(() => {
                      navigate("/login");
                    });
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={"/login"}  className="py-2 px-5 bg-black text-white rounded shadow-lg hover:scale-105 transition-all">Login</Link>
                <Link to={"/register"}  className="py-2 px-5 bg-black text-white rounded shadow-lg hover:scale-105 transition-all">Register</Link>
              </>
            )}
          </div>
          <div
            className="hidden max-lg:block cursor-pointer"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <RxHamburgerMenu className="text-4xl" />
          </div>
        </nav>
      </header>
      {isMenuOpen && (
        <div>
          <nav className="fixed top-0 right-0 left-0 bottom-0 lg:bottom-auto bg-slate-100  ">
            <div
              className="hidden max-lg:block fixed right-0  px-8 py-4 cursor-pointer"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <AiOutlineClose className="text-4xl" />
            </div>
            <ul className=" lg:hidden flex flex-col items-center justify-center h-full ">
              {navLinks.map((item) => (
                <li
                  key={item.label}
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                >
                  <a
                    href={item.href}
                    className="font-montserrat leading-normal text-lg text-slate-gray"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="flex gap-2 text-lg leading-normal font-medium font-montserrat max-lg:hidden wide:mr-24">
                {userLoggedIn ? (
                  <>
                    <button  
                      onClick={() => {
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </li>
              <li>
                <div className="flex gap-2 text-lg leading-normal  font-montserrat  wide:mr-24">
                  {userLoggedIn ? (
                    <>
                      <button
                        onClick={() => {
                          doSignOut().then(() => {
                            setIsMenuOpen(!isMenuOpen);
                            navigate("/login");
                          });
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center">
                        <Link
                          to={"/login"}
                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                          Login
                        </Link>

                        <Link
                          to={"/register"}
                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                          Register
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};
export default Navbar;