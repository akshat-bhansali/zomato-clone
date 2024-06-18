import React, { useEffect, useState } from "react";
import { Select, Table, Checkbox, Modal, Button, Upload, Image } from "antd";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase/firebase";
import { Option } from "antd/es/mentions";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Panel = ({ tableData, loading, user }) => {
  const [ordersIds,setOrderIds] = useState([]);
  const handleDishImgUpload = (file, key) => {
    try {
      // const file = fileList[0].originFileObj;
      // console.log("Key to upload ", key);
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
            // console.log("PaymentURL", url);

            const ordersCollection2 = collection(db, "order");

            // Query for documents with the specified conditions
            const q = query(
              ordersCollection2,
              where("resName", "==", curRes),
              where("pay_status", "==", "Not Paid"),
              where("orderId", "in", ordersIds)
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
                  pay_url: url,
                });
                // console.log("Document updated successfully");
              } catch (error) {
                console.error("Error updating document: ", error);
              }
            });

            toast.success("Successfully updated image !");
            getData();
          } catch (e) {
            console.log("error ", e);
          }
        }
      );
    } catch (e) {
      console.log("errors ", e);
    }
  };
  const ordersCollection = collection(db, "order");
  const adminCollection = collection(db, "admin");

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
  const onChangePaid = (e) => {
    setPaidBox(e.target.checked);
    setNotPaidBox(!e.target.checked);
  };
  const onChangeNotPaid = (e) => {
    setPaidBox(!e.target.checked);
    setNotPaidBox(e.target.checked);
  };
  const [paidBox, setPaidBox] = useState(false);
  const [notPaidBox, setNotPaidBox] = useState(true);
  const [data, setData] = useState([]);
  const [mainData, setMainData] = useState([]);

  const [curRes, setCurRes] = useState();
  const [resData, setResData] = useState([]);
  const [resData2, setResData2] = useState(false);
  const [selectedRows, setSelectedRows] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sum, setSum] = useState(0);

  const [curPaymentId, setCurPaymentId] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const navigate = useNavigate();
  async function getData() {
    setData(null);
    const q = query(ordersCollection);

    let temp = {};
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let it = 0;
      querySnapshot.forEach(async (doc) => {
        let orderObj = {
          key: it++,
          orderId: doc.data().orderId,
          customer: doc.data().userEmail,
          orderValue: doc
            .data()
            .orderDetails.reduce(
              (acc, curr) => acc + parseFloat(curr.price),
              0
            ),
          pay_status: doc.data().pay_status,
          pay_url: doc.data().pay_url,
        };
        if (temp[doc.data().resName]) temp[doc.data().resName].push(orderObj);
        else temp[doc.data().resName] = [orderObj];
      });
      setCurRes(Object.keys(temp)[0]);
    }
    setData(temp);
    return;
  }
  const getRes=async()=>{
    setResData2(false)
    const q = query(adminCollection, where("name", "==", curRes));
      const querySnapshot2 = await getDocs(q);
      querySnapshot2.forEach(async (doc) => {
        const tempRes = [];
        tempRes?.push(doc.data());
        setResData(tempRes);
      });
      setResData2(true);
      // console.log(resData)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      // console.log(selectedRows, "s");
      setSelectedRows(selectedRows);
      const orderIds = selectedRows.map(row => row.orderId);
      // console.log(orderIds, "orderIds");
      setOrderIds(orderIds);
    },
    getCheckboxProps: (record) => ({
      disabled: record.title === "Disabled User",
      title: record.title,
    }),
  };
  useEffect(() => {
    getData();
  }, []);
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
        // console.log(row);
        val += row?.orderValue;
      }
    });
    setCurPaymentId(id);
    setSum(val);
  }, [selectedRows]);
  useEffect(()=>{
    // console.log("a",curRes)
    if(curRes!="" && curRes!=undefined){
      setResData([]);
      getRes();
    }
  },[curRes])

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h1 className="font-bold text-2xl text-gray-800">
          <span className="text-indigo-600">{" SuperAdmin"}</span>
        </h1>
      </div>
      <div className="mb-6">
        {data && (
          <Select
            defaultValue={curRes}
            className="w-full md:w-1/3"
            onChange={(e) => setCurRes(e)}
          >
            {Object.keys(data).map((op, i) => (
              <Option key={i} value={op}>
                {op}
              </Option>
            ))}
          </Select>
        )}
      </div>
      {resData2 && <div>
        Owner Name - {resData[0]?.owner_name}<br/>
        Owner Contact - +91 {resData[0]?.owner_contact}<br/>
        Contact - +91 {resData[0]?.contact}<br/>
        Email - {resData[0]?.email}<br/>
        FSSAI License - <Image src={`${resData[0]?.FSSAILicense?.link}`}/>
        QR code - <Image src={`${resData[0]?.bankAccount?.link}`}/>
        Pan Card - <Image src={`${resData[0]?.panCard?.link}`}/>
        <Button onClick={()=>{navigate(`/restaurant/${btoa(resData[0]?.email)}`)}}>View Restaurant</Button>
      </div>}
      <div className="flex items-center space-x-4 mb-6">
        {data && (
          <>
            <Checkbox
              onChange={onChangePaid}
              checked={paidBox}
              className="text-lg"
            >
              Paid
            </Checkbox>
            <Checkbox
              onChange={onChangeNotPaid}
              checked={notPaidBox}
              className="text-lg"
            >
              Not Paid
            </Checkbox>
            {notPaidBox && (
              <Button
                onClick={showModal}
                disabled={sum === 0}
                className="bg-blue-500 text-white hover:bg-blue-700"
              >
                Pay
              </Button>
            )}
          </>
        )}
      </div>
      {mainData && curRes && (
        <Table
          title={() => (
            <h2 className="text-2xl font-bold text-left">{curRes}</h2>
          )}
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={mainData}
          className="shadow-md rounded-lg overflow-auto"
        />
      )}
      <Modal
        title="Payment Confirmation"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <Button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold rounded"
          >
            Cancel
          </Button>
        }
        className="rounded-lg"
      >
        <p className="text-lg mb-4 flex items-center">
          Pay ₹<p className="font-bold text-xl m-3">{sum}</p> to
          <p className="font-bold text-xl m-3 text-indigo-600">{curRes}</p>
        </p>
        <div className="flex flex-col items-center justify-evenly mt-5">
          {/* QR Image */}
          <Image src={`${resData[0]?.bankAccount?.link}`} alt="QR Code" className="mb-5 w-40 h-40" />
          <Upload
            beforeUpload={(f) => {
              handleDishImgUpload(f, curPaymentId);
              // No need to call handleOk(1) since we're not using the OK button
            }}
            fileList={null}
            className="hover:bg-gray-100"
          >
            <Button className="bg-blue-500 text-white hover:bg-blue-700">
              Click to Upload
            </Button>
          </Upload>
        </div>
      </Modal>
    </div>
  );
};

export default Panel;
