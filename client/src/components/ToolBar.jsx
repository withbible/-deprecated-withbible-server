import React from "react";
import { Link } from "react-router-dom";

const ToolBar = () => {
  return (
    <div>
      <Link to="/">
        <span>홈</span>
      </Link>
      <Link to="/user/login">
        <span style={{ float: "right " }}>로그인</span>
      </Link>
      <Link to="/user/membership">
        <span style={{ float: "right ", marginRight: 10 }}>회원가입</span>
      </Link>
    </div>
  );
};

export default ToolBar;
