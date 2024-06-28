import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { Button, Card, Divider, Image, List, Space, Skeleton } from "antd";
import ProductCard from "./productCard";
import axios from "axios";
import { addOrderToFirestore } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Input, Result } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "antd/es/transfer/search";

const { TextArea } = Input;

export default function Cart() {
  const { currentUser } = useAuth();
  const user = getAuth().currentUser;
  const navigate = useNavigate();
  const userCollection = collection(db, "user");
  const couponsCollection = collection(db, "coupons");
  const [userData, setUserData] = useState(null);
  const [toatlPrice, setTotalPrice] = useState(null);
  const [instruction, setInstruction] = useState(null);
  const platformFee = 3;
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponText, setCouponText] = useState("");
  const [finalVal, setFinalVal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponsData, setCouponsData] = useState([]);
  async function getUserData() {
    if (user?.email == null) {
      return;
    }

    const q = query(userCollection, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return;
    }
    const v = querySnapshot?.docs[0];

    const res = v.data();
    let sum = 0;
    res?.cart?.forEach((ele) => {
      sum += Number(ele.price) * Number(ele.cnt);
    });
    setTotalPrice(sum + platformFee);
    setFinalVal(sum);
    setUserData(v.data());
    if (sum == 0) {
      toast.error("Cart Is Empty");
      navigate("/home");
    }
    const q3 = query(couponsCollection);
    const querySnapshot3 = await getDocs(q3);
    const temp = [];
    querySnapshot3.forEach(async (doc) => {
      temp.push(doc.data());
    });
    setCouponsData(temp);
  }

  useEffect(() => {
    setCouponText(appliedCoupon);
    const price = finalVal;
    const matchingCoupon = couponsData.find(
      (coupon) => coupon.name === appliedCoupon
    );
    if (appliedCoupon != "") {
      if (matchingCoupon) {
        if (price >= matchingCoupon.above) {
          const temp = (price * Number(matchingCoupon.discount)) / 100;
          const newDisc = Math.min(Number(matchingCoupon.upto), temp);
          if (matchingCoupon.upto) {
            const newDisc = Math.min(Number(matchingCoupon.upto), temp);
            setTotalPrice(price + 3 - newDisc);
            setDiscount(newDisc);
            toast.success("Coupon Applied");
          } else {
            const newDisc = temp;
            setTotalPrice(price + 3 - newDisc);
            setDiscount(newDisc);
            toast.success("Coupon Applied");
          }
        } else if (!matchingCoupon.above) {
          const temp = (price * Number(matchingCoupon.discount)) / 100;
          const newDisc = Math.min(Number(matchingCoupon.upto), temp);
          if (matchingCoupon.upto) {
            const newDisc = Math.min(Number(matchingCoupon.upto), temp);
            setTotalPrice(price + 3 - newDisc);
            setDiscount(newDisc);
            toast.success("Coupon Applied");
          } else {
            const newDisc = temp;
            setTotalPrice(price + 3 - newDisc);
            setDiscount(newDisc);
            toast.success("Coupon Applied");
          }
        } else {
          toast.error(
            `Add items worth ₹${Number(
              Number(matchingCoupon.above) - Number(price)
            )} more to avail this coupon`
          );
          setDiscount(0);
          setTotalPrice(finalVal + 3);
        }
      } else {
        toast.error("No coupon found");
        setDiscount(0);
        setTotalPrice(finalVal + 3);
      }
    }
  }, [appliedCoupon, finalVal]);
  useEffect(() => {
    if (user?.email == null || user?.email == "") {
      toast.error("Login First");
      navigate("/login");
      return;
    }
    getUserData();
  }, []);

  const handleUpdateQuantity = async (pos, qty) => {
    // console.log(pos," is ",qty)
    let cart = userData?.cart;
    // console.log("before ",{...userData})
    cart[pos].cnt = qty;
    // console.log("after ",{...userData,cart})
    const q = query(userCollection, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    const doc = querySnapshot.docs[0];
    // console.log("doc data ", doc.data());

    await updateDoc(doc.ref, { ...userData, cart });

    toast.success("Updated quantity");
    setAppliedCoupon("");
    getUserData();
  };
  //   const handleRemoveItem = ()=>{}
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
      toast.success("Emptied Cart");
    });
  };
  const initPayment = (data) => {
    const options = {
      key: "rzp_test_FFmybeRKLHkZGx",
      amount: data.amount,
      currency: data.currency,
      name: userData?.resName,
      description: "temp",
      image: userData?.resImg,
      order_id: data.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            "https://zomato-clone-backend-1pw8.onrender.com/verify",
            response
          );
          try {
            const orderId = await addOrderToFirestore(
              userData?.email,
              userData?.resId,
              userData?.cart,
              response?.razorpay_payment_id,
              userData?.resImg,
              userData?.resName,
              userData?.name,
              instruction
            );
            toast.success("Order added successfully");
            // navigate("/orders");
            setOrderPlaced(true);
            removeFromCart();
          } catch (error) {
            console.error("Error adding order:", error);
          }
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp2 = new window.Razorpay(options);
    rzp2.open();
  };
  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "https://zomato-clone-backend-1pw8.onrender.com/api/process/payment",
        { amount: toatlPrice }
      );
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      {!orderPlaced && (
        <div style={{ margin: "0 auto", padding: "20px" }}>
          <h2 className="font-bold text-xl m-3">Your Shopping Cart</h2>
          {userData?.cart?.map((item, ind) => (
            <ProductCard
              key={item.id}
              item={item}
              onUpdateQuantity={(value) => handleUpdateQuantity(ind, value)}
              //   onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
          <TextArea
            rows={4}
            placeholder="Enter cooking instruction,max length =20"
            maxLength={20}
            value={instruction}
            onChange={(e) => {
              setInstruction(e.target.value);
            }}
          />
          <Space.Compact style={{ width: "100%" }}>
            <Input
              value={couponText}
              placeholder="Enter Coupon Code"
              onChange={(e) => {
                setCouponText(e.target.value);
              }}
            />
            <Button
              type="dashed"
              onClick={() => {
                setAppliedCoupon(couponText);
              }}
            >
              Apply
            </Button>
          </Space.Compact>
          <List
            itemLayout="horizontal"
            dataSource={couponsData}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    onClick={() => {
                      setAppliedCoupon(item.name);
                    }}
                    key="list-loadmore-edit"
                  >
                    Apply
                  </Button>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={<h2>{item.name}</h2>}
                    description={`Get ${item.discount}% off ${
                      item.upto ? `upto ₹${item.upto}` : ""
                    } ${item.above ? `on orders above ₹${item.above}` : ""}`}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
          <Divider />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button onClick={handlePayment} size="large">
              Proceed to Checkout
            </Button>
            <div>
              <p className="font-semibold text-gray-500 ">Sum: ₹{finalVal} </p>
              {discount != 0 && (
                <p className="font-semibold text-gray-500 ">
                  Discount: -₹{discount}{" "}
                </p>
              )}
              <p className="font-semibold text-gray-500 ">
                Platform fee: ₹{platformFee}{" "}
              </p>
              <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                Total: ₹{toatlPrice}
              </div>
            </div>
          </div>
        </div>
      )}
      {orderPlaced && (
        <Result
          status="success"
          title={`Order Placed!`}
          subTitle={`Order Id: ${orderId} Your Order will shortly begin to prepare, please wait.`}
          extra={[
            <Button
              key="buy"
              onClick={() => {
                navigate("/orders");
              }}
            >
              View Orders
            </Button>,
          ]}
        />
      )}
    </>
  );
  //   return (<div className="flex p-10 flex-col">
  //     <div className="flex">
  //     {
  //         userData?.cart?.map((v,i)=>{
  //             return (
  //                 <div>
  //                 <ProductCard
  //                     quantity={v.cnt}
  //                     name={v.item}
  //                     image={v?.image?.link}
  //                     price={v.price}
  //                 />
  //                 </div>

  //         )
  //         })
  //     }
  //     </div>
  //         <div>{`Total Price : ${toatlPrice}`}</div>
  //         <button>Checkout</button>
  //   </div>)
}
