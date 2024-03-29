import { Button, Table } from "antd";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";

const RestaurantDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const columns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "describe",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Image",
      key: "image",
      dataIndex: "image",
      render: (imgd, d) => {
        return (
          <>
            <div className="flex align-middle justify-evenly">
              <img src={imgd?.link} className="w-7 h-7" />
            </div>
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "key",
      render: (k, record) => {
        return (
          <>
            <div className="flex justify-evenly">
              <Button
                className="bg-blue-300"
                type="secondary"
                onClick={() => {
                  if (user?.email == null || user?.email == "") {
                    navigate("/login");
                    alert("Login First");
                    return;
                  }
                  removeFromCart(record);
                }}
              >
                -
              </Button>
              {getCount(record.key)}
              <Button
                className="bg-blue-300"
                type="secondary"
                onClick={() => {
                  if (user?.email == null || user?.email == "") {
                    navigate("/login");
                    alert("Login First");
                    return;
                  }
                  addToCart(record);
                }}
              >
                +
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  const [details, setDetails] = useState([]);
  const [user, setUser] = useState();
  const adminCollection = collection(db, "admin");
  const userCollection = collection(db, "user");

  const getCount = (k) => {
    if (!user?.email) return 0;
    // await getUserData();
    if (userData?.resId !== atob(id)) return 0;
    let result = 0;
    userData?.cart?.forEach((v) => {
      if (v.key === k) result = v.cnt;
    });
    return result;
  };
  const addToCart = async (rec) => {
    // console.log("Recordd ",rec);
    // return;
    const q = query(userCollection, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      // console.log("doc data ", doc.data());
      const data = doc.data();
      let newData = data;
      if (!data?.resId) {
        newData.resId = atob(id);
        newData.resImg = details.resPicLink;
        newData.resName = details.name;
      } else {
        if (data.resId !== atob(id) || data?.resId === null) {
          newData.resId = atob(id);
          newData.resImg = details.resPicLink;
          newData.resName = details.name;
          newData.cart = [];
        }
      }
      let flag = true;
      let lis =
        newData?.cart?.map((v, i) => {
          if (v.key === rec.key) {
            flag = false;
            return { ...v, cnt: v?.cnt ? v.cnt + 1 : 1 };
          } else {
            return v;
          }
        }) || [];

      if (flag) {
        lis.push({ ...rec, cnt: 1 });
      }
      newData.cart = lis;
      await updateDoc(doc.ref, { ...newData });
      getUserData();
      alert("Added to Cart");
    });
  };
  const removeFromCart = async (rec) => {
    // console.log("Recordd ",rec);
    // return;
    const q = query(userCollection, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      // console.log("doc data ", doc.data());
      const data = doc.data();

      if (!data?.resId) {
        return;
      } else {
        if (data.resId !== atob(id)) {
          return;
        }
      }
      let flag = false;
      let lis =
        data?.cart
          ?.map((v, i) => {
            if (v.key === rec.key) {
              if (v.cnt === 1) return;
              return { ...v, cnt: v?.cnt ? v.cnt - 1 : 1 };
            } else {
              return v;
            }
          })
          .filter((v) => v) || [];

      if (lis.length == 0) {
        // console.log({ ...data,cart:[],resId:null})
        await updateDoc(doc.ref, {
          ...data,
          cart: lis,
          resId: null,
          resImg: null,
          resName:null
        });
      } else await updateDoc(doc.ref, { ...data, cart: lis });
      getUserData();
      alert("Removed from cart to Cart");
    });
  };
  async function getUserData() {
    // const user = localStorage.getItem('user')
    // console.log("user ",user);
    if (user?.email == null) {
      return;
    }

    const q = query(userCollection, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    querySnapshot?.forEach((v) => {
      setUserData(v.data());
      // console.log("sdf ",v.data());
      return v.data();
    });
  }
  async function getData() {
    setDetails(null);
    const q = query(adminCollection, where("email", "==", atob(id)));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(await adminCollection, {
        email: atob(id),
      });
      setDetails({ email: atob(id) });
    } else {
      querySnapshot.forEach(async (doc) => {
        setDetails(doc.data());
        console.log("doc data ", doc.data());
      });
    }
    return;
  }
  // React.useEffect(() => {
  //   // console.log("Restaurant ID:", id);
  // }, [id]);
  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    // console.log(user);
  }, [localStorage.getItem("user")]);
  React.useEffect(() => {
    // getUserData();
    getData();
  }, []);
  React.useEffect(() => {
    getUserData();
    // getData();
  }, [user]);

  return (
    <div>
      <h2>Restaurant Details</h2>
      <p>Restaurant Email: {atob(id)}</p>
      {<Table columns={columns} dataSource={details?.dishes} />}
    </div>
  );
};

export default RestaurantDetails;
