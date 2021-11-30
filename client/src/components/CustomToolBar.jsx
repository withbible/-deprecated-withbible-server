import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { RecordContext } from "../context/RecordContext";
import "./CustomToolBar.css";
import "../styles/style.css";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const CustomToolBar = () => {
  const { name, setName, setRecord } = useContext(RecordContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOutHandler = async () => {
    try {
      await axios.patch("/user/logout");
      setName();
      setRecord(null);
      toast.success("로그아웃!");
      window.location.replace("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className="bg-yellow" position="static">
        <Toolbar>
          <Link to="/">
            <HomeIcon className="css-blue" fontSize="large" sx={{ mr: 2 }} />
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className="css-blue"
          >
            홈
          </Typography>

          {name ? (
            <>
              <AccountBoxIcon
                onMouseOver={handleClick}
                className="icon-profile css-blue"
              >
                마이페이지
              </AccountBoxIcon>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  onMouseLeave: handleClose,
                }}
              >
                <a href="/mypage/score">
                  <MenuItem className="tooltip-profile">나의 점수</MenuItem>
                </a>
              </Menu>

              <LogoutIcon
                onClick={logOutHandler}
                className="icon-logout css-blue"
              >
                로그아웃
              </LogoutIcon>
            </>
          ) : (
            <>
              <a href="/auth/login">
                <Button>로그인</Button>
              </a>
              <a href="/auth/register">
                <Button>회원가입</Button>
              </a>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default CustomToolBar;
