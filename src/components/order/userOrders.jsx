import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Avatar, Button, Collapse, Image } from 'antd';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const { Meta } = Card;
const { Panel } = Collapse;

const UserOrders = ({user}) => {
    // console.log("User ",user)
    const ordresCollection = collection(db, "order");
    const getOrders = async ()=>{
        const q = query(ordresCollection, where("userEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        let listOrders = []

        querySnapshot?.docs?.map((v,i)=>{
            console.log(i," ",v.data());
            let totalPrice = 0;
            v.data()?.orderDetails.forEach((v,i)=>totalPrice+=(Number(v.cnt)*Number(v.price)))
            listOrders.push({...v.data(),totalPrice:totalPrice});
        })
        setOrders(listOrders);
    }
    useEffect(()=>{
        getOrders();
    },[])
    const [orders,setOrders] = useState(null);

    const orderss = [
        {
          id: 1,
          restaurant: 'Restaurant A',
          time: '1 hour ago',
          status: 'Delivered',
          totalPrice: '$25',
          
        },
        {
          id: 2,
          restaurant: 'Restaurant B',
          time: '2 hours ago',
          status: 'Cancelled',
          totalPrice: '$30',
        },
      ];
  return (
    <div className="p-5 border shadow-lg rounded-lg">
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h1 className="font-bold text-2xl text-gray-800">
          Your
          <span className="text-indigo-600"> orders</span>
        </h1>
      </div>
      <Row gutter={[16, 16]}>
        {orders?.map((order) => (
          <Col span={24} key={order.id} className="mb-4">
            <div className="border rounded-lg shadow-md p-4 bg-white text-left  ">
              <Row className="items-center">
                <Col xs={24} lg={2} className="text-center mb-4 lg:mb-0">
                  <Image src={order.resImg} height={70} width={70} className="mx-auto" />
                </Col>
                <Col xs={24} lg={3} className="text-center mb-4 lg:mb-0">
                  <p className="text-lg font-bold">{order.resName}</p>
                  <p>{order.time}</p>
                </Col>
                <Col xs={24} lg={3} className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0">
                  <p className="font-semibold text-md opacity-70">Status</p>
                  <p className='text-lg font-bold'>{order.status}</p>
                </Col>
                <Col xs={24} lg={3} className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0">
                  <p className="font-semibold text-md opacity-70">Total Price</p>
                  <p className='text-lg font-bold'>Rs {order.totalPrice}</p>
                </Col>
                <Col xs={24} lg={3} className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0">
                  <p className="font-semibold text-md opacity-70">OTP</p>
                  <p className='text-lg font-bold'>{order?.otp}</p>
                </Col>
                <Col xs={24} lg={4} className="text-left flex justify-between lg:flex-col  mb-4 lg:mb-0">
                  <p className="font-semibold text-md opacity-70">Name</p>
                  <p className='text-lg font-bold'>{order?.userName}</p>
                </Col>
                <Col xs={24} lg={4} className="text-left flex justify-between lg:flex-col mb-4 lg:mb-0">
                  <p className="font-semibold text-md opacity-70">Instruction</p>
                  <p className='text-lg font-bold'>{order.instruction?order?.instruction:"-"}</p>
                </Col>
                <Col xs={24} lg={2}>
                  <Collapse>
                    <Panel header="Order Details" key="1">
                      <p className="font-semibold text-md opacity-70">Order ID: {order.orderId}</p>
                      {order.orderDetails.map((item, index) => (
                        <div key={index} className="mb-2">
                          <p className="font-semibold">
                            Item: {item.item} Rs {item.price} x {item.cnt}
                          </p>
                        </div>
                      ))}
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default UserOrders;
