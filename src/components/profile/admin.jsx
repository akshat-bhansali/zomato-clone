import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {v4 as uuidv4} from 'uuid';
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
      render: (url) => (
        <>
          <img src={url} className="w-7 h-7" />
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <Button
            className="bg-blue-300"
            type="secondary"
            onClick={() => {
              showModal(record);
            }}
          >
            Open Modal
          </Button>
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={()=>handleOk(record.key)}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={()=>handleOk(record.key)}>
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

            <div className="text-xs mb-[-4px] ml-1 mt-5">Item Description</div>
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
            <img src={record.image} className="w-5 h-5" />
          </Modal>
        </>
      ),
    },
  ];
  const showModal = (record) => {
    setIsModalOpen(true);
    setModalItemName(record?.item ? record.item : "");
    setModalItemDesc(record?.describe ? record.describe : "");
    setModalItemPrice(record?.price ? record.price : 0);
  };
  const handleOk = (k) => {

    setIsModalOpen(false);
    saveTableData(k,{key:k ,item:modalItemName,describe:modalItemDesc,price:modalItemPrice});
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
    saveTableData(-1,{key:uuidv4(),item:modalItemName2,describe:modalItemDesc2,price:modalItemPrice2});
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
  const data = [
    {
      key: "1",
      item: "John Brown",
      description: "something good",
      price: 50,
      image:
        "https://firebasestorage.googleapis.com/v0/b/zomato-clone-417913.appspot.com/o/iit2022005%40iiitl.ac.in%2FRestaurantPic-armin-3.jpg?alt=media&token=8dc74339-1f3d-45d9-ba56-47c56d6af9c0",
    },
  ];
  const [fileList, setFileList] = useState([]);
  const [tableData, setTableData] = useState();

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
              addDoc(await adminCollection, {
                email: user.email,
                resPicPath: uploadTask.snapshot.ref.fullPath,
                resPicLink: url,
              })
                .then((res) => console.log("result ", res))
                .catch((e) => console.log("error ", e));
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

  const handleDistImgUpload = (file, path) => {
    try {
      // const file = fileList[0].originFileObj;
      console.log(file);
      // console.log(fileList);

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
              addDoc(await adminCollection, {
                email: user.email,
                resPicPath: uploadTask.snapshot.ref.fullPath,
                resPicLink: url,
              })
                .then((res) => console.log("result ", res))
                .catch((e) => console.log("error ", e));
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
  async function saveTableData(pos,tdata)
  {
    let lis = details?.dishes || []
    if(pos==-1)
    {
      lis = [...lis,{...tdata}]
      console.log("List ",lis);
    }else{
      lis = lis.filter((v,i)=>{console.log(v.key,"   ",tdata.key); return v.key!==tdata.key})
      console.log("deleted ",lis);
      lis = [...lis,{...tdata}]
    }
    console.log("lis ",lis);
    return;
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.forEach(async (doc) => {
      console.log(details);
      await updateDoc(doc.ref, { ...details,dishes:[...lis] });
      setDetails({ ...details,dishes:[...lis] })
      alert("Saved changes");
    });
    getTableData();
  }
  async function getTableData() {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty){
      querySnapshot.forEach(async (doc) => {
        setTableData(doc.data()?.dishes);
        console.log("table data ", doc.data()?.dishes);
      });
    }
  }
  useEffect(() => {
    async function getData() {
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
    
    getData();
    getTableData();
    // getTableData();
  }, []);

  return (
    <>
      <div>welcome to your restaurant {user?.name}</div>

      <>
        {details && (
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              maxWidth: 900,
            }}
          >
            <Form.Item label="Restaurant Name">
              <Input
                value={details.name}
                onChange={(v) => {
                  setDetails({ ...details, name: v.target.value });
                }}
              />
            </Form.Item>
            <Form.Item label="List your restaurant online :">
              <Switch defaultChecked={details?.publish} onChange={(v)=>setDetails({...details,publish:v})} />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                value={details?.address}
                onChange={(v) =>
                  setDetails({ ...details, address: v.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Picode">
              <Input
                type="number"
                size="6"
                maxLength={6}
                onChange={(v) =>
                  setDetails({ ...details, pincode: v.target.value })
                }
                onError={(e) => console.log(e)}
                value={details?.pincode}
              />
            </Form.Item>
            <Form.Item label="Veg">
              <Radio.Group
                onChange={(v) =>
                  setDetails({ ...details, veg: v.target.value })
                }
                defaultValue={details?.veg}
              >
                <Radio value="veg" defaultChecked={details?.veg == true}>
                  Veg Only
                </Radio>
                <Radio value="non-veg" defaultChecked={details?.veg === false}>
                  Veg and Non-Veg
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Cusines">
              <Select
                mode="tags"
                style={{
                  width: "100%",
                }}
                placeholder="Tags Mode"
                defaultValue={details && details?.cusines}
                onChange={(v) => setDetails({ ...details, cusines: v })}
                options={categoriesOptions}
              />
            </Form.Item>

            <Form.Item
              label="Restaurant Pic"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <div className="flex gap-10">
                {details?.resPicLink && <img src={details?.resPicLink} />}
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
                      style={{
                        border: 0,
                        background: "none",
                      }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Choose
                      </div>
                    </button>
                  )}
                </Upload>
              </div>
              <Button
                disabled={fileList.length == 0}
                onClick={() => {
                  handleUpload();
                  // handleClearFileList();
                }}
              >
                Upload
              </Button>
            </Form.Item>
            <Form.Item label="Button">
              <Button onClick={saveDetails}>Save Changes</Button>
            </Form.Item>
          </Form>
        )}
      </>
      <Button onClick={showModal2}>Add Item</Button>
      <Table columns={columns} dataSource={tableData} />
      <Modal
        title="Basic Modal"
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        footer={[
          <Button key="back" onClick={handleOk2}>
            SAVE
          </Button>,
        ]}
      >
        <div className="text-xs mb-[-4px] ml-1">Item Name</div>

        <Input
          placeholder={"Enter Item Name"}
          value={modalItemName2}
          onChange={(e) => {
            setModalItemName2(e.target.value);
          }}
        />

        <div className="text-xs mb-[-4px] ml-1 mt-5">Item Description</div>
        <Input
          placeholder={"Enter Item Description"}
          value={modalItemDesc2}
          onChange={(e) => {
            setModalItemDesc2(e.target.value);
          }}
        />
        <div className="text-xs mb-[-4px] ml-1 mt-5">Item Price</div>
        <Input
          type="number"
          placeholder={"Enter Item Price"}
          value={modalItemPrice2}
          onChange={(e) => {
            setModalItemPrice2(e.target.value);
          }}
        />
        {/* <img src={record.image} className="w-5 h-5" /> */}
      </Modal>
    </>
  );
}

export default AdminProfile;
