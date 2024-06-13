import React, { useEffect, useState } from "react";
import { Row, Col, Collapse, Image, Select } from "antd";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Panel } = Collapse;

const OrderCard = ({ order }) => {
  const [selectedOption, setSelectedOption] = useState(order.status);
  const [options, setOptions] = useState([
    { value: "Order Placed", label: "Order Placed" },
    { value: "Preparing Order", label: "Preparing Order" },
    { value: "Ready for pickup", label: "Ready for pickup" },
    { value: "Order Picker Up", label: "Order Picker Up" },
  ]);

  const handleChange = async (selected) => {
    try {
      const newStatus = selected;
      const q = query(
        collection(db, "order"),
        where("orderId", "==", order.orderId)
      );
      const querySnapshot = await getDocs(q);
      const orderDoc = querySnapshot.docs[0];
      await updateDoc(orderDoc.ref, { status: newStatus });
      setSelectedOption(selected);
      setOptions((prevOptions) => {
        if (newStatus === "Preparing Order") {
          return prevOptions.filter(
            (option) => option.value !== "Order Placed"
          );
        } else if (newStatus === "Ready for pickup") {
          return prevOptions.filter(
            (option) =>
              option.value !== "Order Placed" &&
              option.value !== "Preparing Order"
          );
        } else if (newStatus === "Order Picker Up") {
          return prevOptions.filter(
            (option) =>
              option.value !== "Order Placed" &&
              option.value !== "Preparing Order" &&
              option.value !== "Ready for pickup"
          );
        } else {
          return prevOptions;
        }
      });
      toast.success("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    const newStatus = order?.status;
    setOptions((prevOptions) => {
      if (newStatus === "Preparing Order") {
        return prevOptions.filter((option) => option.value !== "Order Placed");
      } else if (newStatus === "Ready for pickup") {
        return prevOptions.filter(
          (option) =>
            option.value !== "Order Placed" &&
            option.value !== "Preparing Order"
        );
      } else if (newStatus === "Order Picker Up") {
        return prevOptions.filter(
          (option) =>
            option.value !== "Order Placed" &&
            option.value !== "Preparing Order" &&
            option.value !== "Ready for pickup"
        );
      } else {
        return prevOptions;
      }
    });
  }, [order]);

  return (
    <>
      <ToastContainer />
      <Col span={24} key={order.id} className="mb-4">
        <div className="border rounded-lg shadow-md p-4 bg-white text-left">
          <Row className="items-center">
            <Col xs={24} lg={2} className="text-center mb-4 lg:mb-0">
              <Image
                src={order.resImg}
                height={70}
                width={70}
                className="mx-auto"
              />
            </Col>
            <Col xs={24} lg={3} className="text-center mb-4 lg:mb-0">
              <p className="text-lg font-bold">{order.resName}</p>
              <p>{order.time}</p>
            </Col>
            <Col
              xs={24}
              lg={3}
              className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0"
            >
              <p className="font-semibold text-md opacity-70">Status</p>
              {selectedOption == "Order Picker Up" ? (
                <>Order Picked Up</>
              ) : (
                <Select
                  value={selectedOption}
                  style={{ width: 150 }}
                  onChange={handleChange}
                  options={options}
                />
              )}
            </Col>
            <Col
              xs={24}
              lg={3}
              className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0"
            >
              <p className="font-semibold text-md opacity-70">Total Price</p>
              <p className="text-lg font-bold">₹{order.totalPrice}</p>
            </Col>
            <Col
              xs={24}
              lg={3}
              className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0"
            >
              <p className="font-semibold text-md opacity-70">OTP</p>
              <p className="text-lg font-bold">{order?.otp}</p>
            </Col>
            <Col
              xs={24}
              lg={3}
              className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0"
            >
              <p className="font-semibold text-md opacity-70">Name</p>
              <p className="text-lg font-bold">{order?.userName}</p>
            </Col>
            <Col
              xs={24}
              lg={4}
              className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0"
            >
              <p className="font-semibold text-md opacity-70">Instruction</p>
              <p className="text-lg font-bold">
                {order.instruction ? order?.instruction : "-"}
              </p>
            </Col>
            <Col xs={24} lg={3}>
              <Collapse>
                <Panel header="Order Details" key="1">
                  <p className="font-semibold text-md opacity-70">
                    Order ID: {order.orderId}
                  </p>
                  {order.orderDetails.map((item, index) => (
                    <div key={index} className="mb-2">
                      <p className="font-semibold">
                        Item: {item.item} ₹{item.price} x {item.cnt}
                      </p>
                    </div>
                  ))}
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </div>
      </Col>
    </>
  );
};

export default OrderCard;
