import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import Navbar from "../navbar";

const Header = () => {
  return (
    <>
      <Navbar />
    </>
  );
};

export default Header;
