import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { AuthContext } from "../context/AuthContext";

const ToolBar = () => {
  const { me, setMe, setRecord } = useContext(AuthContext);

  const logOutHandler = async () => {
    try {
      await axios.patch("/user/logout");
      setMe();
      setRecord(null);
      toast.success("로그아웃!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  return (
    <div>
      <Link to="/">
        <span>홈</span>
      </Link>
      {me ? (
        <span
          onClick={logOutHandler}
          style={{ float: "right", cursor: "pointer" }}
        >
          로그아웃({me.name})
        </span>
      ) : (
        <>
          <Link to="/auth/login">
            <span style={{ float: "right" }}>로그인</span>
          </Link>
          <Link to="/auth/register">
            <span style={{ float: "right", marginRight: 10 }}>회원가입</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
