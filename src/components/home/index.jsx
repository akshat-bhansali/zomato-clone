import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { db, storage } from "../../firebase/firebase";
import { Card, Avatar } from "antd";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  snapshotEqual,
  updateDoc,
  where,
} from "firebase/firestore";
import LazyLoad from "react-lazyload";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "../scrollToTop";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [restData, setRestData] = useState([]);
  const [showRes, setShowRes] = useState(false);
  const adminCollection = collection(db, "admin");
  const q = query(adminCollection, where("publish", "==", true));
  const getRestaurants = async () => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const tempRes = restData;
      tempRes.push(doc.data());
      setRestData(tempRes);
    });
    setShowRes(true);
    console.log(restData);
  };
  useEffect(() => {
    getRestaurants();
  }, []);
  return (
    <>
      {/* <div className="text-2xl font-bold pt-14">
      Hello {currentUser?.displayName ? currentUser?.displayName : "User"}, you
      are now logged in.
    </div> */}
      <img src="./banner.jpg" className="h-1/2" />
      {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <div className="text-6xl font-bold">TAGLINE</div>
        <div className="text-4xl">Sub Heading</div>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-5">
        {showRes &&
          restData.map((restaurant, i) => {
            const handleCardClick = () => {
              const decodedEmail = btoa(restaurant.email);
              const route = `/restaurant/${decodedEmail}`;
              navigate(route);
            };

            return (
              <LazyLoad
                key={i}
                height={200}
                once
                className="justify-self-center"
              >
                <button
                  className="max-w-xs overflow-hidden hover:shadow-lg rounded-lg p-2"
                  onClick={handleCardClick}
                >
                  <img
                    className="w-full rounded-lg mr-2 border h-[200px]"
                    src={
                      restaurant?.resPicLink
                        ? restaurant?.resPicLink
                        : "./banner.jpg"
                    }
                    alt="Card"
                  />
                  <div className="bg-gray-400 w-full h-[2px] rounded-lg my-2"></div>
                  <div className="">
                    <div className="flex gap-x-20">
                      <div className="font-bold text-xl mb-2 text-start pl-2">
                      {restaurant?.name ? (restaurant.name.length > 10 ? restaurant.name.slice(0, 10) + '...' : restaurant.name) : "No Name"}
                      </div>
                      <div className="flex">
                        <div className="flex border rounded-lg p-2 bg-green-700 mt-[-3px]">
                          <div className="text-white font-bold">{(restaurant?.rating/restaurant?.ratingCount) || 'N/A'}</div>{" "}
                          <FaStar className="text-white mt-1 ml-1" />
                        </div>
                        <div className="w-1 bg-black rounded-md mx-2"></div>
                        <img
                        className="w-8 h-8 mt-1"
                          src={
                            restaurant?.veg == "veg"
                              ? "./veg.jpeg"
                              : "./veg+non.jpeg"
                          }
                        />
                      </div>
                    </div>
                    <p className="text-gray-700 text-start pl-2">
                          {restaurant.address?restaurant.address:"No Address"}
                    </p>
                  </div>
                </button>
              </LazyLoad>
            );
          })}
      </div>
      <ScrollToTopButton />
    </>
  );
};

export default Home;
