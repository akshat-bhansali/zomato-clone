import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Button, Collapse, Image } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import OrderCard from "./OrderCard";

const { Meta } = Card;
const { Panel } = Collapse;

const AdminOrders = ({ user }) => {
  // console.log("User admin",user.role)
  const ordresCollection = collection(db, "order");
  const getOrders = async () => {
    const q = query(ordresCollection, where("resEmail", "==", user.email));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    let listOrders = [];

    querySnapshot?.docs?.map((v, i) => {
      console.log(i, " ", v.data());
      let totalPrice = 0;
      v.data()?.orderDetails.forEach(
        (v, i) => (totalPrice += Number(v.cnt) * Number(v.price))
      );
      listOrders.push({ ...v.data(), totalPrice: totalPrice });
    });
    setOrders(listOrders);
  };
  useEffect(() => {
    getOrders();
  }, []);
  const [orders, setOrders] = useState(null);
  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {orders?.map((order) => (
          <OrderCard order={order}/>
        ))}
      </Row>
    </div>
  );
};

export default AdminOrders;
