import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { Button, Card, Divider, List, Space, Skeleton } from "antd";
import ProductCard from "./productCard";
import axios from "axios";
import { addOrderToFirestore } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Input, Result } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { TextArea } = Input;

export default function Cart() {
  const { currentUser } = useAuth();
  const user = getAuth().currentUser;
  const navigate = useNavigate();
  const userCollection = collection(db, "user");
  const couponsCollection = collection(db, "coupons");
  const [userData, setUserData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
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
    if (!user?.email) return;

    const q = query(userCollection, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return;

    const userData = querySnapshot.docs[0].data();
    const cartSum = userData?.cart?.reduce((sum, item) => sum + Number(item.price) * Number(item.cnt), 0) || 0;

    setTotalPrice(cartSum + platformFee);
    setFinalVal(cartSum);
    setUserData(userData);

    if (cartSum === 0) {
      toast.error("Cart Is Empty");
      navigate("/home");
    }

    const couponsQuerySnapshot = await getDocs(query(couponsCollection));
    setCouponsData(couponsQuerySnapshot.docs.map(doc => doc.data()));
  }

  useEffect(() => {
    if (!user?.email) {
      toast.error("Login First");
      navigate("/login");
      return;
    }
    getUserData();
  }, []);

  useEffect(() => {
    setCouponText(appliedCoupon);

    const matchingCoupon = couponsData.find(coupon => coupon.name === appliedCoupon);
    if (appliedCoupon && matchingCoupon) {
      const price = finalVal;
      if (price >= (matchingCoupon.above || 0)) {
        const discountAmount = Math.min((price * matchingCoupon.discount) / 100, matchingCoupon.upto || Infinity);
        setDiscount(discountAmount);
        setTotalPrice(price + platformFee - discountAmount);
        toast.success("Coupon Applied");
      } else {
        toast.error(`Add items worth ₹${matchingCoupon.above - price} more to avail this coupon`);
        resetDiscount();
      }
    } else if (appliedCoupon) {
      toast.error("No coupon found");
      resetDiscount();
    }
  }, [appliedCoupon, finalVal]);

  const resetDiscount = () => {
    setDiscount(0);
    setTotalPrice(finalVal + platformFee);
  };

  const handleUpdateQuantity = async (index, quantity) => {
    const updatedCart = [...userData.cart];
    updatedCart[index].cnt = quantity;

    const userDoc = (await getDocs(query(userCollection, where("email", "==", user.email)))).docs[0];
    await updateDoc(userDoc.ref, { ...userData, cart: updatedCart });

    toast.success("Updated quantity");
    setAppliedCoupon("");
    getUserData();
  };

  const removeFromCart = async () => {
    const userDoc = (await getDocs(query(userCollection, where("email", "==", currentUser.email)))).docs[0];
    await updateDoc(userDoc.ref, {
      ...userDoc.data(),
      cart: [],
      resId: null,
      resImg: null,
      resName: null,
    });
    toast.success("Emptied Cart");
  };

  const initPayment = (data) => {
    const options = {
      key: "rzp_test_FFmybeRKLHkZGx",
      amount: data.amount,
      currency: data.currency,
      name: userData.resName,
      description: "temp",
      image: userData.resImg,
      order_id: data.id,
      handler: async (response) => {
        const { data: verifyData } = await axios.post("https://zomato-clone-backend-1pw8.onrender.com/verify", response);
        const orderId = await addOrderToFirestore(
          userData.email,
          userData.resId,
          userData.cart,
          response.razorpay_payment_id,
          userData.resImg,
          userData.resName,
          userData.name,
          instruction
        );

        toast.success("Order added successfully");
        setOrderPlaced(true);
        removeFromCart();
        setOrderId(orderId);
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async () => {
    const { data } = await axios.post("https://zomato-clone-backend-1pw8.onrender.com/api/process/payment", { amount: totalPrice });
    initPayment(data.data);
  };

  return (
    <>
      <ToastContainer />
      {!orderPlaced && (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="font-bold text-2xl mb-6">Your Shopping Cart</h2>
          {userData?.cart?.map((item, index) => (
            <ProductCard
              key={item.id}
              item={item}
              onUpdateQuantity={(value) => handleUpdateQuantity(index, value)}
              onRemove={() => handleUpdateQuantity(index, 0)}
            />
          ))}
          <TextArea
            rows={4}
            placeholder="Enter cooking instruction, max length = 20"
            maxLength={20}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="mt-6 w-full border border-gray-300 rounded-lg p-2"
          />
          <Space className="mt-4 flex justify-center">
            <Input
              value={couponText}
              placeholder="Enter Coupon Code"
              onChange={(e) => setCouponText(e.target.value)}
              className="w-full"
            />
            <Button
              type=""
              onClick={() => setAppliedCoupon(couponText)}
              className="whitespace-nowrap"
            >
              Apply
            </Button>
          </Space>
          <List
            itemLayout="horizontal"
            dataSource={couponsData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    onClick={() => setAppliedCoupon(item.name)}
                    key="list-loadmore-edit"
                  >
                    Apply
                  </Button>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={<h3 className="font-bold">{item.name}</h3>}
                    description={`Get ${item.discount}% off ${item.upto ? `upto ₹${item.upto}` : ""} ${item.above ? `on orders above ₹${item.above}` : ""}`}
                  />
                </Skeleton>
              </List.Item>
            )}
            className="mt-6"
          />
          <Divider />
          <div className="flex justify-between items-center mt-4">
            <Button
              type="primary"
              size="large"
              onClick={handlePayment}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Proceed to Checkout
            </Button>
            <div className="text-right">
              <p className="text-lg text-gray-600">Sum: ₹{finalVal}</p>
              {discount !== 0 && (
                <p className="text-lg text-gray-600">Discount: -₹{discount}</p>
              )}
              <p className="text-lg text-gray-600">Platform fee: ₹{platformFee}</p>
              <p className="text-xl font-bold">Total: ₹{totalPrice}</p>
            </div>
          </div>
        </div>
      )}
      {orderPlaced && (
        <Result
          status="success"
          title="Order Placed!"
          subTitle={`Order Id: ${orderId} Your Order will shortly begin to prepare, please wait.`}
          extra={[
            <Button
              key="buy"
              onClick={() => navigate("/orders")}
              className="bg-blue-500 hover:bg-blue-600"
            >
              View Orders
            </Button>,
          ]}
        />
      )}
    </>
  );
}
