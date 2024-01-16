import React, { useState } from "react";
// redux imports
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat, fetchChats } from "../redux/chatsSlice";
//APis Iport
import { removeUser } from "../apis/chat";
// Socket imports
import io from "socket.io-client";
import { Grid, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVertOutlined";
// import { MoreVert as MoreVertIcon } from '@mui/material';
const ENDPOINT = process.env.REACT_APP_SERVER_URL;
let socket;

const Header = () => {
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.activeUser);
  const { activeChat } = useSelector((state) => state.chats);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const leaveGC = async () => {
    const userId = activeUser.id;
    const chatId = activeChat._id;
    const chat = await removeUser({ userId, chatId });
    dispatch(setActiveChat(''));
    socket.emit("leaved group", chat, activeUser.name, userId);
    dispatch(fetchChats());
    setAnchorEl(null);
  };

  React.useEffect(() => {
    socket = io(ENDPOINT);
  }, []);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="h5" className="header-message">
         Welcome Chat App
        </Typography>
      </Grid>
      <Grid item xs={6} container justifyContent="flex-end">
        <IconButton
          aria-controls="header-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="header-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {activeChat?.isGroup ? (
            <MenuItem onClick={() => leaveGC()} color="primary">
              Leave Group
            </MenuItem>
          ) : (
            <>
              <MenuItem color="primary">coming...</MenuItem>
            </>
          )}
        </Menu>
      </Grid>
    </Grid>
  );
};

export default Header;
