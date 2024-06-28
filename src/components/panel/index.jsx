import React, { useEffect, useState } from "react";
import {
  Select,
  Table,
  Checkbox,
  Modal,
  Button,
  Upload,
  Image,
  Input,
} from "antd";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase/firebase";
import { Option } from "antd/es/mentions";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Panel = ({ tableData, loading, user }) => {
  const [ordersIds, setOrderIds] = useState([]);
  const [coupons, setCoupons] = useState([]);
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
            setIsModalOpen(false);
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
  const couponsCollection = collection(db, "coupons");
  const handleDelete = async (name) => {
    const q = query(couponsCollection, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    getCoupons();
    toast.success("Coupon Deleted");
  };
  const columns2 = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Discount (in %)",
      dataIndex: "discount",
    },
    {
      title: "Upto (in ₹)",
      dataIndex: "upto",
    },
    {
      title: "Above (in ₹)",
      dataIndex: "above",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => {
        return (
          <>
            <Button
              className="bg-red-500"
              type="secondary"
              onClick={() => {
                handleDelete(record.name);
              }}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];
  const columns = [
    {
      title: "OrderId",
      dataIndex: "orderId",
      render: (text) => (
        <div href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      render: (text) => (
        <div href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </div>
      ),
    },
    {
      title: "OrderValue",
      dataIndex: "orderValue",
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
  const [modalCouponName, setModalCouponName] = useState("");
  const [modalCouponDiscount, setModalCouponDiscount] = useState("");
  const [modalCouponAbove, setModalCouponAbove] = useState("");
  const [modalCouponUpto, setModalCouponUpto] = useState("");
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const addCoupon = async () => {
    try {
      const newCoupon = {
        name: modalCouponName,
        discount: modalCouponDiscount,
        above: modalCouponAbove,
        upto: modalCouponUpto,
      };

      await addDoc(couponsCollection, newCoupon);
      toast.success("Coupon added successfully!");
      setIsModalOpen2(false);
      getCoupons();
    } catch (e) {
      console.error("Error adding coupon: ", e);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
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
  const getRes = async () => {
    setResData2(false);
    const q = query(adminCollection, where("name", "==", curRes));
    const querySnapshot2 = await getDocs(q);
    querySnapshot2.forEach(async (doc) => {
      const tempRes = [];
      tempRes?.push(doc.data());
      setResData(tempRes);
    });
    setResData2(true);
    // console.log(resData)
  };

  const getCoupons = async () => {
    const q = query(couponsCollection);
    const querySnapshot2 = await getDocs(q);
    const temp = [];
    querySnapshot2.forEach(async (doc) => {
      temp.push(doc.data());
    });
    setCoupons(temp);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      // console.log(selectedRows, "s");
      setSelectedRows(selectedRows);
      const orderIds = selectedRows.map((row) => row.orderId);
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
  useEffect(() => {
    // console.log("a",curRes)
    getCoupons();
    if (curRes != "" && curRes != undefined) {
      setResData([]);
      getRes();
    }
  }, [curRes]);

  return (
    <>
  <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
    <ToastContainer />
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 border-b-2 border-gray-200">
      <h1 className="font-bold text-2xl text-gray-800">
        <span className="text-indigo-600">SuperAdmin</span>
      </h1>
    </div>
    <div className="flex flex-col md:flex-row md:space-x-6">
      {/* Left Section - Restaurant Details */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md mb-6 md:mb-0 border border-gray-200">
        <div className="mb-6">
          {data && (
            <Select
              defaultValue={curRes}
              className="w-full border border-gray-300 rounded-lg"
              onChange={(e) => setCurRes(e)}
            >
              {Object.keys(data).map((op, i) => (
                <Option key={i} value={op} className="font-bold">
                  {op}
                </Option>
              ))}
            </Select>
          )}
        </div>
        {resData2 && (
          <div className="bg-white p-6 space-y-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-indigo-800">
              Restaurant Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700 font-bold border-b border-gray-200 pb-2">
                <span className="font-semibold">Owner Name:</span>{" "}
                {resData[0]?.owner_name}
              </p>
              <p className="text-gray-700 font-bold border-b border-gray-200 pb-2">
                <span className="font-semibold">Owner Contact:</span> +91{" "}
                {resData[0]?.owner_contact}
              </p>
              <p className="text-gray-700 font-bold border-b border-gray-200 pb-2">
                <span className="font-semibold">Contact:</span> +91{" "}
                {resData[0]?.contact}
              </p>
              <p className="text-gray-700 font-bold border-b border-gray-200 pb-2">
                <span className="font-semibold">Email:</span>{" "}
                {resData[0]?.email}
              </p>
              <p className="text-gray-700 font-bold border-b border-gray-200 pb-2">
                <span className="font-semibold">FSSAI License:</span>{" "}
                <Image
                  src={`${resData[0]?.FSSAILicense?.link}`}
                  alt="FSSAI License"
                  className="inline-block w-20 h-20 rounded-lg border border-gray-300"
                />
              </p>
              <p className="text-gray-700 font-bold border-b border-gray-200 pb-2">
                <span className="font-semibold">QR Code:</span>{" "}
                <Image
                  src={`${resData[0]?.bankAccount?.link}`}
                  alt="QR Code"
                  className="inline-block w-20 h-20 rounded-lg border border-gray-300"
                />
              </p>
              <p className="text-gray-700 font-bold">
                <span className="font-semibold">Pan Card:</span>{" "}
                <Image
                  src={`${resData[0]?.panCard?.link}`}
                  alt="Pan Card"
                  className="inline-block w-20 h-20 rounded-lg border border-gray-300"
                />
              </p>
            </div>
            <Button
              onClick={() => {
                navigate(`/restaurant/${btoa(resData[0]?.email)}`);
              }}
              className="bg-indigo-600 text-white hover:bg-indigo-800 rounded-lg mt-4"
            >
              View Restaurant
            </Button>
          </div>
        )}
      </div>
      {/* Right Section - Orders Table */}
      <div className="md:w-2/3">
        <div className="w-full">
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
                    className="bg-blue-500 text-white hover:bg-blue-700 rounded"
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
                <h2 className="text-2xl font-bold text-left border-b border-gray-200 pb-2">{curRes}</h2>
              )}
              loading={loading}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={mainData}
              className="shadow-md rounded-lg overflow-auto border border-gray-200"
            />
          )}
        </div>

        <div>
          <div className="">
            <Modal
              title="Add New Coupon"
              open={isModalOpen2}
              onOk={handleOk2}
              onCancel={handleCancel2}
              footer={[
                <Button
                  key="back"
                  onClick={addCoupon}
                  className="bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Coupon
                </Button>,
              ]}
            >
              <div className="mb-4">
                <label className="text-xs font-bold mb-2 block">
                  Coupon Name
                </label>
                <Input
                  placeholder="Enter Coupon Name"
                  value={modalCouponName}
                  onChange={(e) => {
                    setModalCouponName(e.target.value);
                  }}
                  className="border rounded-lg p-2"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold mb-2 block">
                  Upto (in ₹)
                </label>
                <Input
                  placeholder="Enter Price"
                  value={modalCouponUpto}
                  onChange={(e) => {
                    setModalCouponUpto(e.target.value);
                  }}
                  className="border rounded-lg p-2"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold mb-2 block">
                  Discount (in %)
                </label>
                <Input
                  type="number"
                  placeholder="Enter Price"
                  value={modalCouponDiscount}
                  onChange={(e) => {
                    setModalCouponDiscount(e.target.value);
                  }}
                  className="border rounded-lg p-2"
                />
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold mb-2 block">
                  Above (in ₹)
                </label>
                <Input
                  type="number"
                  placeholder="Enter Price"
                  value={modalCouponAbove}
                  onChange={(e) => {
                    setModalCouponAbove(e.target.value);
                  }}
                  className="border rounded-lg p-2"
                />
              </div>
            </Modal>
            <Button
              className="bg-green-600 text-white rounded-lg hover:bg-green-700 my-4"
              onClick={() => {
                setIsModalOpen2(true);
              }}
            >
              Add Coupon
            </Button>
          </div>
          <Table
            title={() => (
              <h2 className="text-2xl font-bold text-left border-b border-gray-200 pb-2">Your Coupons</h2>
            )}
            loading={loading}
            columns={columns2}
            dataSource={coupons}
            className="shadow-md rounded-lg overflow-auto border border-gray-200"
          />
        </div>
      </div>
    </div>

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
        Pay ₹<span className="font-bold text-xl mx-2">{sum}</span> to
        <span className="font-bold text-xl mx-2 text-indigo-600">
          {curRes}
        </span>
      </p>
      <div className="flex flex-col items-center justify-evenly mt-5">
        <Image
          src={`${resData[0]?.bankAccount?.link}`}
          alt="QR Code"
          className="mb-5 w-40 h-40 border border-gray-300"
        />
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
    </>
  );
};

export default Panel;
