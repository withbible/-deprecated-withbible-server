import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { AuthContext } from "../context/AuthContext";

import { AppBar, Box, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';


const ToolBar = () => {
  const { me, setMe, setRecord } = useContext(AuthContext);
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
      setMe();
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
<AppBar style={{ background: '#fff176' }} position="static">
    <Toolbar>
        <Link to="/" style={{textDecoration: 'none'}}>
            <HomeIcon style={{ color: '#64b5f6' }} fontSize="large" sx={{ mr: 2 }} />
        </Link>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ color: '#64b5f6', fontFamily:"NanumSquare" }}>
        KBU_Study
        </Typography>

        {me ? (
            <>        
                <AccountBoxIcon onMouseOver={handleClick} style={{ color: '#64b5f6', padding: '10px' }}>마이페이지</AccountBoxIcon>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClick={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <a href="/mypage/score" style={{ textDecoration: 'none' }}>
                    <MenuItem style={{width:"100%", height:40, fontFamily:"NanumSquare", color: "#64b5f6" }} >나의 점수</MenuItem>
                    </a>
                </Menu>

                <LogoutIcon onClick={logOutHandler} style={{ color: '#64b5f6', padding: '10px' }}>로그아웃</LogoutIcon>
            </>
        ) : (
            <>
                <a href="/auth/login" style={{ textDecoration: 'none' }}>
                    <Button style={{ color: '#64b5f6', fontFamily:"NanumSquare" }}>로그인</Button>
                </a>
                <a href="/auth/register" style={{ textDecoration: 'none' }}>
                    <Button style={{ color: 'w#64b5f6ite', fontFamily:"NanumSquare" }}>회원가입</Button>
                </a>
            </>
        )}
    </Toolbar>
    </AppBar>
</Box>
  );
};

export default ToolBar;
