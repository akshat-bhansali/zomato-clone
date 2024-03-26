import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import AdminProfile from "./admin";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
export default function Profile() {
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [localStorage.getItem("user")]);

  return (
    <div>
      {user?.role === "admin" ? (
        <AdminProfile user={user} />
      ) : (
        <>welcome {user?.name ?? ""}</>
      )}
    </div>
  );
}
