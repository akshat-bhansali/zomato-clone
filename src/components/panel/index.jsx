import React, { useEffect, useState } from "react";
import { Select, Table,Checkbox,Modal, Button } from "antd";
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
  const onChangePaid= (e) => {
    setPaidBox(e.target.checked);
    setNotPaidBox(!e.target.checked);
  };
  const onChangeNotPaid= (e) => {
    setPaidBox(!e.target.checked);
    setNotPaidBox(e.target.checked);
  };
  const [paidBox,setPaidBox] = useState(false);
  const [notPaidBox,setNotPaidBox] = useState(true);
  const [data,setData] = useState([]);
  const [mainData,setMainData] = useState([]);

  const [curRes,setCurRes] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sum,setSum] = useState(0);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function getData() {
    setData(null);
    const q = query(ordersCollection);

    let temp={};
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let it = 0;
      querySnapshot.forEach(async (doc) => {
        let orderObj = {
          key:it++,
          orderId:doc.data().orderId,
          customer:doc.data().userEmail,
          orderValue:doc.data().orderDetails.reduce((acc, curr) => acc + parseFloat(curr.price), 0),
          pay_status:doc.data().pay_status,
        }
        if(temp[doc.data().resName])
        temp[doc.data().resName].push(orderObj);
        else temp[doc.data().resName]=[orderObj];
      });
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
      console.log(selectedRows,"s")
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
  useEffect(() => {
    setSelectedRows([]);
    if (!data || !data[curRes]) {
      return; 
    }
    const rest = data[curRes];
    let temp = [];
    for (let i = 0; i < rest.length; i++) {
      if (rest[i].pay_status === "Paid" && paidBox) {
        temp.push(rest[i]);
      } else if (rest[i].pay_status === "Not Paid" && notPaidBox) {
        temp.push(rest[i]);
      }
    }
    setMainData(temp);
  }, [paidBox, notPaidBox, data, curRes]);
  
  useEffect(() => {
    let val = 0;
    selectedRows?.forEach((row) => {
      if (row?.orderValue) {
        val += row?.orderValue;
      }
    });
    setSum(val);
  }, [selectedRows]);
  
  
  return (
    <div>
    {data && <Select defaultValue={curRes} style={{ width: 200 }} onChange={(e)=>{setCurRes(e)}}>
      {
        Object.keys(data).map((op,i)=>{

          return <Option key={i} value={op}>{op}</Option>
        })
      }
    </Select>}
    {data && <Checkbox onChange={onChangePaid} checked={paidBox}>Paid</Checkbox>}
    {data && <Checkbox onChange={onChangeNotPaid} checked={notPaidBox}>Not Paid</Checkbox>}
    {data && notPaidBox && <Button onClick={showModal}>Pay</Button>}
      {mainData && curRes && <Table
        title={()=>curRes}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={mainData}
      />}
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Pay {sum} to {curRes}</p>
        <Button>Pay now</Button>
      </Modal>
    </div>
  );
};

export default Panel;