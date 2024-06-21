import React, { useEffect, useState } from "react";
import { Row } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import OrderCard from "./OrderCard";

const AdminOrders = ({ user }) => {
  const ordresCollection = collection(db, "order");

  const getOrders = async () => {
    const q = query(ordresCollection, where("resEmail", "==", user.email));
    const querySnapshot = await getDocs(q);
    let listOrders = [];
    querySnapshot?.docs?.map((v) => {
      let totalPrice = 0;
      v.data()?.orderDetails.forEach(
        (item) => (totalPrice += Number(item.cnt) * Number(item.price))
      );
      listOrders.push({ ...v.data(), totalPrice });
    });
    listOrders.reverse();
    setOrders(listOrders);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const [orders, setOrders] = useState(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h1 className="font-bold text-2xl text-gray-800">
          Recieved
          <span className="text-indigo-600"> Orders</span>
        </h1>
      </div>
      <div className="mb-8">
        <div className="bg-red-50 p-4 rounded-lg shadow-md mb-6">
          <h2 className="font-bold text-xl text-gray-800 mb-4">Pending Orders</h2>
          <Row gutter={[16, 16]}>
            {orders?.map((order) =>
              order?.status !== "Order Picked Up" ? (
                <OrderCard order={order} key={order.id} />
              ) : null
            )}
          </Row>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-md">
          <h2 className="font-bold text-xl text-gray-800 mb-4">Previous Orders</h2>
          <Row gutter={[16, 16]}>
            {orders?.map((order) =>
              order?.status === "Order Picked Up" ? (
                <OrderCard order={order} key={order.id} />
              ) : null
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
