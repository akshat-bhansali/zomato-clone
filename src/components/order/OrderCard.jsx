import React, { useEffect, useState } from "react";
import { Card, Col, Image, Collapse } from "antd";
import { Select } from "antd";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
const { Meta } = Card;
const { Panel } = Collapse;

const OrderCard = ({ order }) => {
    const ordresCollection = collection(db, "order");
  const [selectedOption, setSelectedOption] = useState(order.status);
  const [options, setOptions] = useState([
    {
      value: "Order Placed",
      label: "Order Placed",
    },
    {
      value: "Preparing Order",
      label: "Preparing Order",
    },
    { value: "Ready for pickup", label: "Ready for pickup" },
    { value: "Order Picker Up", label: "Order Picker Up" },
  ]);

  const handleChange = async (selected) => {
    try {
      const newStatus = selected;
  
      // Query the database to find the specific order document
      const q = query(collection(db, "order"), where("orderId", "==", order.orderId));
      const querySnapshot = await getDocs(q);
  
      // Assuming there's only one document matching the orderId
      const orderDoc = querySnapshot.docs[0];
  
      // Update the order status in the database
      await updateDoc(orderDoc.ref, { status: newStatus });
  
      setSelectedOption(selected);
      setOptions(prevOptions => {
        if (newStatus === "Preparing Order") {
          return prevOptions.filter(option => option.value !== "Order Placed");
        } else if (newStatus === "Ready for pickup") {
          return prevOptions.filter(option => option.value !== "Order Placed" && option.value !== "Preparing Order");
        } else if (newStatus === "Order Picker Up") {
            return prevOptions.filter(option => option.value !== "Order Placed" && option.value !== "Preparing Order" && option.value !== "Ready for pickup");
          } 
          else {
          return prevOptions;
        }
      });
      alert("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  useEffect(() => {
    // Update options based on the current order status
    const newStatus = order?.status;
    setOptions(prevOptions => {
        if (newStatus === "Preparing Order") {
          return prevOptions.filter(option => option.value !== "Order Placed");
        } else if (newStatus === "Ready for pickup") {
          return prevOptions.filter(option => option.value !== "Order Placed" && option.value !== "Preparing Order");
        } else if (newStatus === "Order Picker Up") {
            return prevOptions.filter(option => option.value !== "Order Placed" && option.value !== "Preparing Order" && option.value !== "Ready for pickup");
          } 
          else {
          return prevOptions;
        }
      });
  }, [order]);
  return (
    <div>
      <Col span={8} key={order.id}>
        <Card style={{ width: 300 }}>
          <Meta
            avatar={<Image src={order.resImg} height={50} width={50} />}
            title={order.resName}
            description={order.time}
          />
          {options.length > 1 ? (
            <Select
              value={selectedOption}
              style={{ width: 120 }}
              onChange={handleChange}
              options={options}
            />
          ) : (
            <div>
              <p>{options[0].label}</p>
            </div>
          )}
          <p>Total Price: ₹{order.totalPrice}</p>
          <p>OTP : {order?.otp}</p>
          <p>Name : {order?.userName}</p>
          <Collapse>
            <Panel header="Order Details" key="1">
                <p>
                    order id : {order.orderId}
                </p>
              {order.orderDetails.map((item, index) => (
                <div key={index}>
                  <p>
                    Item: {item.item} Rs {item.price} x {item.cnt}{" "}
                  </p>
                </div>
              ))}
            </Panel>
          </Collapse>
        </Card>
      </Col>
    </div>
  );
};

export default OrderCard;
