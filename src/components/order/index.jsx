import React from 'react'
import UserOrders from './userOrders'
import { useAuth } from '../../contexts/authContext'


const Orders = () => {
  const user = useAuth();

  return (
    <div>
      <UserOrders user={user.currentUser}/>
    </div>
  )
}

export default Orders
