import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScrollToTopButton = () => {
  const { currentUser } = useAuth();
  const [cartResName, setCartResName] = useState("");
  const [cartResImg, setCartResImg] = useState("");
  const [cartResItem, setCartResItem] = useState("");
  const [cartResEmail, setCartResEmail] = useState("");
  const [cartResPrice, setCartResPrice] = useState(0);
  const userCollection = collection(db, "user");
  const navigate = useNavigate();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
  };
  const removeFromCart = async () => {
    const q = query(userCollection, where("email", "==", currentUser.email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();

      await updateDoc(doc.ref, {
        ...data,
        cart: [],
        resId: null,
        resImg: null,
        resName: null,
      });
      setCartResItem(0);
      toast.success("Removed Cart");
    });
  };
  const getCartData = async () => {
    const q = query(userCollection, where("email", "==", currentUser.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      setCartResName(data.resName);
      setCartResImg(data.resImg);
      setCartResEmail(data.resId);
      let price = 0;
      let count = 0;
      data?.cart?.map((item, i) => {
        price += Number(Number(item?.price) * Number(item?.cnt));
        count += Number(item?.cnt);
      });
      setCartResPrice(price);
      setCartResItem(count);
    });
  };
  useEffect(() => {
    getCartData();
  }, []);
  return (
    <div className="flex">
      <ToastContainer/>
      <div
        className={`fixed lg:bottom-10 lg:left-10 bottom-3 left-3 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 h-[80px]   ${
          cartResItem > 0 ? "flex" : "hidden"
        }`}
      >
        <div
          className={`${cartResItem > 0 ? "flex" : "hidden"} justify-between`}
        >
          {/* menu */}
          <div className="flex">
            <img src={cartResImg} className="w-8 h-8 mt-3 rounded-lg" />
            <div className="flex flex-col mt-2 m-2">
              <div className="text-start text-sm text-black">{cartResName}</div>
              <div className="flex items-center text-xs text-black">
                <div>{cartResItem} Item</div>
                <div className="m-1 bg-gray-200 rounded-full w-[2px] h-4"></div>
                <button
                  onClick={() => {
                    navigate(`/restaurant/${btoa(cartResEmail)}`);
                  }}
                >
                  View Menu &#8594;
                </button>
              </div>
            </div>
          </div>
          {/* cart */}
          <Link to="/cart">
            <button
              className="bg-red-500 p-2 flex flex-col items-center rounded-md mx-2"
              onClick={handleCartClick}
            >
              <div className="text-white text-sm">₹{cartResPrice}</div>
              <div className="ml-2 text-white text-xs pr-1">View Cart</div>
            </button>
          </Link>
          {/* cancel */}
          <button
            onClick={removeFromCart}
            className="bg-gray-200 rounded-lg w-6 h-6 self-center"
          >
            &times;
          </button>
        </div>
      </div>
      <button
        onClick={handleScrollToTop}
        className="fixed lg:bottom-10 bottom-3 text-2xl lg:text-5xl lg:right-10 right-3 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <FaArrowUp />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
