import React, { useEffect, useState } from "react";
import { Select, Table,Checkbox,Modal, Button, Upload, Image } from "antd";
import { collection, getDocs, query, where,updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebase";
import { Option } from "antd/es/mentions";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";



const Panel = ({ tableData, loading,user }) => {
  const handleDishImgUpload = (file,key) => {
    try {
      // const file = fileList[0].originFileObj;
      console.log("Key to upload ", key);
      // console.log(fileList);
      const path = `/${user.email}/payment/${key + "-" + file.name}`;
      const imgRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(imgRef, file);
      uploadTask.on(
        "state_changed",
        (e) => {},
        (e) => {
          console.log("Some error occured while uploading ", e);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
console.log("PaymentURL", url);

const ordersCollection2 = collection(db, "order");

// Query for documents with the specified conditions
const q = query(
  ordersCollection2,
  where("resName", "==", curRes),
  where("pay_status", "==", "Not Paid")
);

// Get the documents that match the query
const querySnapshot = await getDocs(q);

// Iterate through each document in the query result
querySnapshot.forEach(async (doc) => {
  // Get a reference to the document
  const docRef = doc.ref;

  // Update the pay_status and pay_url fields
  try {
    await updateDoc(docRef, {
      pay_status: "Paid",
      pay_url: url
    });
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
});

            alert("Successfully updated image !");
            getData();
          } catch (e) {
            alert("Some");
            console.log("error ", e);
            alert("Some");
            console.log("error ", e);
          }
        }
      );
    } catch (e) {
      console.log("errors ", e);
    }
  };
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
    {
      title: "Image",
      dataIndex: "pay_url",
      render: (imgd, d) => {
        return (
          <>
            <Image src={imgd} height={50} className="w-7 h-7" />
          </>
        );
      },
    },
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

  const [curPaymentId,setCurPaymentId] = useState(null);

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
          pay_url : doc.data().pay_url
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
    let id = null;
    selectedRows?.forEach((row) => {
      id = row.orderId;
      if (row?.orderValue) {
        console.log(row);
        val += row?.orderValue;
      }
    });
    setCurPaymentId(id);
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
    {data && notPaidBox && <Button onClick={showModal} disabled={(sum==0)}>Pay</Button>}
      {mainData && curRes && <Table
        title={()=>curRes}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={mainData}
      />}
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Pay {sum} to {curRes}</p>
        <div className="flex align-middle justify-evenly mt-5">
               
                <Upload
                  beforeUpload={(f) => {
                    handleDishImgUpload(f, curPaymentId);
                    handleOk(1);
                  }}
                  fileList={null}
                >
                  <Button>Click to Upload</Button>
                </Upload>
              </div>
        {/* <Button>Pay now</Button> */}
      </Modal>
    </div>
  );
};

export default Panel;
