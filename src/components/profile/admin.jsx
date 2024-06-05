import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Upload,
  Space,
  Table,
  Modal,
  Switch,
} from "antd";
import { db, storage } from "../../firebase/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  snapshotEqual,
  updateDoc,
  where,
} from "firebase/firestore";

function AdminProfile({ user }) {
  const [modalItemName, setModalItemName] = useState("");
  const [modalItemDesc, setModalItemDesc] = useState("");
  const [modalItemPrice, setModalItemPrice] = useState(0);
  const [modalItemUuid, setModalItemUuid] = useState();
  const [modalItemImg, setModalItemImg] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItemName2, setModalItemName2] = useState("");
  const [modalItemDesc2, setModalItemDesc2] = useState("");
  const [modalItemPrice2, setModalItemPrice2] = useState(0);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const adminCollection = collection(db, "admin");
  const q = query(adminCollection, where("email", "==", user.email));

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const categoriesOptions = [
    { value: "North Indian", label: "North Indian" },
    { value: "South Indian", label: "South Indian" },
    { value: "Punjabi", label: "Punjabi" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Rajasthani", label: "Rajasthani" },
    { value: "Maharashtrian", label: "Maharashtrian" },
    { value: "Kerala", label: "Kerala" },
    { value: "Bengali", label: "Bengali" },
    { value: "Hyderabadi", label: "Hyderabadi" },
    { value: "Tamil", label: "Tamil" },
    { value: "Andhra", label: "Andhra" },
    { value: "Goan", label: "Goan" },
  ];

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
      render: (record) => {
        return (
          <>
            <Button
              className="bg-blue-300"
              type="secondary"
              onClick={() => {
                showModal(record);
              }}
            >
              Edit
            </Button>
            <Modal
              title="Basic Modal"
              open={isModalOpen}
              onOk={() => handleOk()}
              onCancel={handleCancel}
              footer={[
                <Button
                  key="back"
                  onClick={() => {
                    handleOk();
                  }}
                >
                  SAVE
                </Button>,
              ]}
            >
              <div className="text-xs mb-[-4px] ml-1">Item Name</div>

              <Input
                placeholder={"Enter Item Name"}
                value={modalItemName}
                onChange={(e) => {
                  setModalItemName(e.target.value);
                }}
              />

              <div className="text-xs mb-[-4px] ml-1 mt-5">
                Item Description
              </div>
              <Input
                placeholder={"Enter Item Description"}
                value={modalItemDesc}
                onChange={(e) => {
                  setModalItemDesc(e.target.value);
                }}
              />
              <div className="text-xs mb-[-4px] ml-1 mt-5">Item Price</div>
              <Input
                type="number"
                placeholder={"Enter Item Price"}
                value={modalItemPrice}
                onChange={(e) => {
                  setModalItemPrice(e.target.value);
                }}
              />
              <div className="flex align-middle justify-evenly mt-5">
                <img src={modalItemImg} className="w-10 h-10" />
                <Upload
                  beforeUpload={(f) => {
                    handleDishImgUpload(f, modalItemUuid);
                    handleOk(1);
                  }}
                  fileList={null}
                >
                  <Button>Click to Upload</Button>
                </Upload>
              </div>
            </Modal>
          </>
        );
      },
    },
  ];
  const showModal = (record) => {
    setIsModalOpen(true);
    setModalItemName(record?.item ? record.item : "");
    setModalItemDesc(record?.describe ? record.describe : "");
    setModalItemPrice(record?.price ? record.price : 0);
    setModalItemUuid(record.key);
    setModalItemImg(record?.image?.link);
  };
  const handleOk = (upd) => {
    setIsModalOpen(false);
    if (!(upd || false))
      saveTableData(modalItemUuid, {
        key: modalItemUuid,
        item: modalItemName,
        describe: modalItemDesc,
        price: modalItemPrice,
      });
    setModalItemDesc("");
    setModalItemName("");
    setModalItemPrice(0);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setModalItemDesc("");
    setModalItemName("");
    setModalItemPrice(0);
  };
  const showModal2 = (record) => {
    setIsModalOpen2(true);
    setModalItemName2(record.item ? record.item : "");
    setModalItemDesc2(record.description ? record.description : "");
    setModalItemPrice2(record.price ? record.price : 0);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
    saveTableData(-1, {
      key: uuidv4(),
      item: modalItemName2,
      describe: modalItemDesc2,
      price: modalItemPrice2,
    });
    setModalItemDesc2("");
    setModalItemName2("");
    setModalItemPrice2(0);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
    setModalItemDesc2("");
    setModalItemName2("");
    setModalItemPrice2(0);
  };
  const [fileList, setFileList] = useState([]);

  const handleClearFileList = () => {
    setFileList([]);
  };
  const handleUpload = () => {
    try {
      const file = fileList[0].originFileObj;
      console.log(file);
      console.log(fileList);
      const path = `/${user.email}/${"RestaurantPic-" + file.name}`;
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
            const querySnapshot = await getDocs(q);
            console.log("Query Snapshot ", querySnapshot);
            if (querySnapshot.empty) {
              console.log("Adding doc");
              const res = await addDoc(await adminCollection, {
                email: user.email,
                resPicPath: uploadTask.snapshot.ref.fullPath,
                resPicLink: url,
              });
              console.log("result ", res);

              console.log("Doc added successfully with pic");
            } else {
              querySnapshot.forEach(async (doc) => {
                const oldPath = doc.get("resPicPath");
                if (oldPath) {
                  try {
                    await deleteObject(ref(storage, oldPath));
                    console.log("Deleted Old File");
                  } catch (e) {
                    console.log("Error while deleting old File", e);
                  }
                }
                const res = await updateDoc(doc.ref, {
                  resPicPath: uploadTask.snapshot.ref.fullPath,
                  resPicLink: url,
                });
              });
            }

            alert("Successfully updated image !");
          } catch (e) {
            alert("Some");
            console.log("error ", e);
            alert("Some");
            console.log("error ", e);
          }
        }
      );
      handleClearFileList();
    } catch (e) {
      console.log("errors ", e);
    }
  };

  const handleDishImgUpload = (file, key) => {
    try {
      // const file = fileList[0].originFileObj;
      console.log("Key to upload ", key);
      // console.log(fileList);
      const path = `/${user.email}/dishes/${key + "-" + file.name}`;
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
            // const q =
            const querySnapshot = await getDocs(q);
            console.log("Query Snapshot ", querySnapshot);
            if (querySnapshot.empty) {
              console.log("Adding doc");
              const res = await addDoc(await adminCollection, {
                email: user.email,
                dishes: [
                  {
                    resPicPath: uploadTask.snapshot.ref.fullPath,
                    resPicLink: url,
                  },
                ],
              });
              console.log("result ", res);

              console.log("Doc added successfully with pic");
            } else {
              let dishData = details?.dishes.filter((v, i) => v.key === key);
              dishData = dishData[0];
              const oldPath = dishData?.image?.path || null;

              querySnapshot.forEach(async (doc) => {
                if (oldPath) {
                  try {
                    await deleteObject(ref(storage, oldPath));
                    console.log("Deleted Old File", oldPath);
                  } catch (e) {
                    console.log("Error while deleting old File", e);
                  }
                }
                console.log("New Data ", details?.dishes);
                let dishLis = details?.dishes.filter((v, i) => v.key !== key);
                dishData = {
                  ...dishData,
                  image: { path: uploadTask.snapshot.ref.fullPath, link: url },
                };
                dishLis.push(dishData);
                console.log("New Data ", dishLis);
                const res = await updateDoc(doc.ref, {
                  dishes: dishLis,
                });
              });
            }
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
  // use states of fields
  const [details, setDetails] = useState(null);
  const saveDetails = async () => {
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.forEach(async (doc) => {
      console.log(details);
      await updateDoc(doc.ref, { ...details });
      alert("Saved changes");
    });
  };
  async function saveTableData(pos, tdata) {
    let lis = details?.dishes || [];
    if (pos == -1) {
      lis = [...lis, { ...tdata }];
      console.log("List ", lis);
    } else {
      lis = lis.filter((v, i) => {
        console.log(v.key, "   ", tdata.key);
        return v.key !== tdata.key;
      });
      console.log("deleted ", lis);
      lis = [...lis, { ...tdata }];
    }
    console.log("lis ", lis);
    // return;
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.forEach(async (doc) => {
      console.log(details);
      await updateDoc(doc.ref, { ...details, dishes: [...lis] });
      setDetails({ ...details, dishes: [...lis] });
      alert("Saved changes");
    });
    getData();
  }
  async function getData() {
    setDetails(null);
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(await adminCollection, {
        email: user.email,
      });
      setDetails({ email: user.email });
    } else {
      querySnapshot.forEach(async (doc) => {
        setDetails(doc.data());
        console.log("doc data ", doc.data());
      });
    }
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className=" p-6">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h1 className="font-bold text-2xl text-gray-800">
          Welcome to your restaurant,{" "}
          <span className="text-indigo-600">{user?.name}</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row">
        {details && (
          <div className="bg-white border p-6 rounded-lg shadow-lg mb-6 lg:w-[35vw]">
            <div>
              <p className="font-bold text-xl opacity-70 text-indigo-600 mb-4">
                Restaurant Details
              </p>
            </div>
            <Form
              labelCol={{ span: 11 }}
              wrapperCol={{ span: 11 }}
              layout="horizontal"
              style={{ maxWidth: 900, font: "bold" }}
              className="text-left"
            >
              <Form.Item
                label="Restaurant Name"
                className="font-bold text-gray-700"
              >
                <Input
                  value={details.name}
                  onChange={(v) =>
                    setDetails({ ...details, name: v.target.value })
                  }
                  className="w-full lg:w-auto"
                />
              </Form.Item>
              <Form.Item
                label="List restaurant online :"
                className="font-bold text-gray-700"
              >
                <Switch
                  className="m-3"
                  defaultChecked={details?.publish}
                  onChange={(v) => setDetails({ ...details, publish: v })}
                />
              </Form.Item>
              <Form.Item label="Address" className="font-bold text-gray-700">
                <Input
                  value={details?.address}
                  onChange={(v) =>
                    setDetails({ ...details, address: v.target.value })
                  }
                  className="border rounded-lg p-2 w-full lg:w-auto"
                />
              </Form.Item>
              <Form.Item label="Pincode" className="font-bold text-gray-700">
                <Input
                  type="number"
                  maxLength={6}
                  onChange={(v) =>
                    setDetails({ ...details, pincode: v.target.value })
                  }
                  value={details?.pincode}
                  className="border rounded-lg p-2 w-full lg:w-auto"
                />
              </Form.Item>
              <Form.Item
                label="Veg"
                className="font-bold text-gray-700 flex items-center"
              >
                <Radio.Group
                  onChange={(v) =>
                    setDetails({ ...details, veg: v.target.value })
                  }
                  defaultValue={details?.veg}
                  className="flex items-center space-x-4"
                >
                  <Radio
                    value="veg-only"
                    defaultChecked={details?.veg === "veg-only"}
                  >
                    Veg Only
                  </Radio>
                  <Radio
                    value="non-veg"
                    defaultChecked={details?.veg === false}
                  >
                    Veg and Non-Veg
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Cuisines" className="font-bold text-gray-700">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Tags Mode"
                  defaultValue={details && details?.cusines}
                  onChange={(v) => setDetails({ ...details, cusines: v })}
                  options={categoriesOptions}
                  className="border rounded-lg w-full lg:w-auto"
                />
              </Form.Item>

              {/* Image Upload Section */}
              <Form.Item
                label="Restaurant Pic"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="font-bold text-gray-700"
              >
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                  {details?.resPicLink && (
                    <img
                      src={details?.resPicLink}
                      className="w-24 h-24 rounded-lg shadow-md"
                    />
                  )}
                  <Upload
                    action={(f) => {}}
                    listType="picture-card"
                    fileList={fileList}
                    multiple={false}
                    maxCount={1}
                    onChange={({ fileList }) => {
                      if (fileList.length) {
                        if (fileList[0].size > 300000) {
                          alert("Image size should be less than 300KB");
                          return;
                        }
                      }
                      setFileList(fileList);
                    }}
                  >
                    {fileList.length === 0 && (
                      <button
                        style={{ border: 0, background: "none" }}
                        type="button"
                        className="text-gray-600 hover:text-black"
                      >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Change</div>
                      </button>
                    )}
                  </Upload>
                </div>
                <Button
                  disabled={fileList.length === 0}
                  onClick={handleUpload}
                  className="mt-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Upload
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={saveDetails}
                  className="bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        {/* Dishes Table and Add Item Modal */}
        <div className="mx-4 p-3 border shadow-lg rounded-lg text-right font-semibold lg:h-[37vh] w-full">
          <Button
            onClick={showModal2}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6 w-full lg:w-auto"
          >
            Add Item
          </Button>

          <Table
            columns={columns}
            dataSource={details?.dishes}
            className="mb-6"
          />

          <Modal
            title="Add New Item"
            open={isModalOpen2}
            onOk={handleOk2}
            onCancel={handleCancel2}
            footer={[
              <Button
                key="back"
                onClick={handleOk2}
                className="bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                SAVE
              </Button>,
            ]}
          >
            <div className="mb-4">
              <label className="text-xs font-bold mb-2 block">Item Name</label>
              <Input
                placeholder="Enter Item Name"
                value={modalItemName2}
                onChange={(e) => {
                  setModalItemName2(e.target.value);
                }}
                className="border rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold mb-2 block">
                Item Description
              </label>
              <Input
                placeholder="Enter Item Description"
                value={modalItemDesc2}
                onChange={(e) => {
                  setModalItemDesc2(e.target.value);
                }}
                className="border rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold mb-2 block">
                Item Price
              </label>
              <Input
                type="number"
                placeholder="Enter Item Price"
                value={modalItemPrice2}
                onChange={(e) => {
                  setModalItemPrice2(e.target.value);
                }}
                className="border rounded-lg p-2"
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
