import React, { useEffect, useState } from "react";
import { Select, Table } from "antd";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Option } from "antd/es/mentions";


const Panel = ({ tableData, loading }) => {
  const ordersCollection = collection(db, "order");
  const columns = [
    {
      title: "OrderId",
      dataIndex: "orderId",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "OrderValue",
      dataIndex: "orderValue",
    },
    {
      title: "Status",
      dataIndex: "pay_status",
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    // },
    // {
    //   title: "Image URL",
    //   dataIndex: "image",
    //   render: (text) => (
    //     <div className="w-[200px] overflow-hidden h-[100px]">
    //       <img
    //         src={text}
    //         alt="no image found"
    //         className="object-contain min-w-full min-h-full"
    //       />
    //     </div>
    //   ),
    // },
  ];
  const [data,setData] = useState([]);

  const [curRes,setCurRes] = useState();
  const [selectedRows, setSelectedRows] = useState();

  async function getData() {
    setData(null);
    const q = query(ordersCollection);

    let temp={};
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let it = 0;
      querySnapshot.forEach(async (doc) => {
        console.log(doc.data(),"123")
        let orderObj = {
          key:it++,
          orderId:doc.data().orderId,
          customer:doc.data().userEmail,
          orderValue:doc.data().orderDetails.reduce((acc, curr) => acc + parseFloat(curr.price), 0),
          pay_status:doc.data().pay_status,
        }
        console.log(doc.data());
        if(temp[doc.data().resName])
        temp[doc.data().resName].push(orderObj);
        else temp[doc.data().resName]=[orderObj];
      });
      console.log("Temp ",temp);
      setCurRes(Object.keys(temp)[0]);
    }
    setData(temp);
    return;
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.title === "Disabled User",
      title: record.title,
    }),
  };
  useEffect(()=>{
    getData();
  },[])
  
  return (
    <div>
    {data && <Select defaultValue="Select a restaurant" style={{ width: 200 }} onChange={(e)=>{setCurRes(e)}}>
      {
        Object.keys(data).map((op,i)=>{

          return <Option key={i} value={op}>{op}</Option>
        })
      }
    </Select>}
      {data && curRes && <Table
        title={()=>curRes}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data[curRes]}
      />}
    </div>
  );
};

export default Panel;
