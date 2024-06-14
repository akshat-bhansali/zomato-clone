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
    console.log(listOrders);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const [orders, setOrders] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h1 className="font-bold text-2xl text-gray-800">
          Recieved
          <span className="text-indigo-600"> Orders</span>
        </h1>
      </div>
      <Row gutter={[16, 16]}>
        <div>Pending Orders</div>
        {orders?.map((order) =>
          order?.status != "Order Picked Up" ? (
            <>
              <OrderCard order={order} key={order.id} />
            </>
          ) : (
            <></>
          )
        )}
      </Row>
      <Row gutter={[16, 16]}>
        <div>Previous Orders</div>
        {orders?.map((order) =>
          order?.status == "Order Picked Up" ? (
            <>
              <OrderCard order={order} key={order.id} />
            </>
          ) : (
            <></>
          )
        )}
      </Row>
    </div>
  );
};

export default AdminOrders;
