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
import ScrollToTopButton from "../scrollToTop/index"

const Home = () => {
  const { currentUser } = useAuth();
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
  <ScrollToTopButton/>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-5">
  {showRes &&
    restData.map((restaurant, i) => {
      const handleCardClick = () => {
        console.log(restaurant.email);
      };

      return (
        <LazyLoad key={i} height={200} once className="justify-self-center">
          <Card
            className="h-full cursor-pointer"
            style={{
              width: 250
            }}
            cover={
              <img
                alt="example"
                src={
                  restaurant?.resPicLink
                    ? restaurant?.resPicLink
                    : "./banner.jpg"
                }
              />
            }
            onClick={handleCardClick}
          >
            <Card.Meta
              avatar={
                <Avatar
                  src={restaurant?.veg ? "./veg.jpeg" : "./veg+non.jpeg"}
                />
              }
              title={restaurant?.name ? restaurant?.name : "No Name"}
              description={
                restaurant?.address ? restaurant?.address : "No Address"
              }
            />
          </Card>
        </LazyLoad>
      );
    })}
</div>

    </>
  );
};

export default Home;
