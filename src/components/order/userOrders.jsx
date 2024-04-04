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
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {orders?.map(order => (
          <Col span={8} key={order.id}>
            <Card style={{ width: 300 }}>
              <Meta
                avatar={<Image src={order.resImg} height={50} width={50}/>}
                title={order.resName}
                description={order.time}
              />
              {/* <img src={ordresCollection.res} */}
              <p>Status: {order.status}</p>
              <p>Total Price: Rs {order.totalPrice}</p>
              <Collapse>
                <Panel header="Order Details" key="1">
                  {order.orderDetails.map((item, index) => (
                    <div key={index}>
                      {/* <p>Item: {item.item}</p> */}
                      <p>Item: {item.item}  Rs {item.price} x {item.cnt} </p>
                      {/* <p>Price: {item.price}</p> */}
                    </div>
                  ))}
                </Panel>
              </Collapse>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default UserOrders;
