import React, { useEffect, useState } from 'react'
import UserOrders from './userOrders'
import { useAuth } from '../../contexts/authContext'
import AdminOrders from './adminOrders';


const Orders = () => {
  const userA = useAuth();
//   console.log("user role ",user)
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [localStorage.getItem("user")]);
  return (
    <div>
      {(user.role=='user')?<UserOrders user={userA.currentUser}/>:<AdminOrders user={userA.currentUser}/>}
    </div>
  )
}

export default Orders
