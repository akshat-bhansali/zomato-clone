import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Select, Upload } from "antd";
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
                // console.log("data", " => ", res);
                // console.log("url", " => ", url);
                // console.log(doc.id, " => ", doc.data());
              });
            }

            alert("Successfully updated image !");
          } catch (e) {
            alert("Some");
            console.log("errro ", e);
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
    </>
  );
}

export default AdminProfile;