import React, { useEffect, useState } from 'react'

export default function Profile() {
    const [user,setUser] = useState({});
    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem("user")));
    },[localStorage.getItem("user")])
  return (
    <div>
      {user?.role=="admin"?<>welcome to your restaurant {user?.name }</>:<>welcome {user?.name ?? ""}</>}
    </div>
  )
}
