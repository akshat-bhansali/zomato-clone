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
      <img
        src="https://images.template.net/113396/world-food-day-banner-background-lgg7g.png "
        className="h-1/2 "
      />
      {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <div className="text-6xl font-bold">TAGLINE</div>
        <div className="text-4xl">Sub Heading</div>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-5 border p-5 ">
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
                className="justify-self-center hover:scale-105 transition-all border rounded-lg"
              >
                <button
                  className="w-[350px] h-96 overflow-hidden shadow-lg hover:shadow-2xl rounded-lg p-3 flex flex-col"
                  onClick={handleCardClick}
                >
                  <img
                    className={`rounded-lg mb-2 border h-[250px] w-full object-cover  ${
                      restaurant.closed ? "grayscale" : ""
                    }`}
                    src={
                      restaurant?.resPicLink
                        ? restaurant?.resPicLink
                        : "https://images.template.net/113396/world-food-day-banner-background-lgg7g.png"
                    }
                    alt="Card"
                  />
                  <div className="bg-gray-400 w-full h-[2px] rounded-lg my-2"></div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex gap-x-5">
                        <div className="font-bold text-xl mb-2 text-start pl-2">
                          {restaurant?.name
                            ? restaurant.name.length > 10
                              ? restaurant.name.slice(0, 10) + "..."
                              : restaurant.name
                            : "No Name"}
                        </div>
                        <div className="flex">
                          <div className="flex border rounded-lg p-2 bg-green-700 mt-[-3px]">
                            <div className="text-white font-bold">
                              {restaurant?.ratingCount
                                ? (
                                    restaurant.rating / restaurant.ratingCount
                                  ).toFixed(2)
                                : "N/A"}
                            </div>
                            <FaStar className="text-white mt-1 ml-1" />
                          </div>
                          <div className="w-1 bg-black rounded-md mx-2"></div>
                          <img
                            className="w-8 h-8 mt-1"
                            src={
                              restaurant?.veg === "veg"
                                ? "veg.jpeg"
                                : "veg+non.jpeg"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-5">
                        <p className="text-gray-700 text-start pl-2">
                          {restaurant.address
                            ? restaurant.address
                            : "No Address"}
                        </p>
                        <p className="text-red-700 text-start pl-2 ml-3">
                          {restaurant?.closed ? "Not accepting orders" : ""}
                        </p>
                      </div>
                    </div>
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
