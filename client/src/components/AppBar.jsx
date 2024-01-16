// reac imports
import React, { useState } from 'react';
// Socket imports
import io from "socket.io-client";
// redux imports
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat, fetchChats } from "../redux/chatsSlice";
import { setNotifications } from "../redux/chatsSlice";
import { setGroupModal } from "../redux/profileSlice";

// ** Apis
import { getNewGroups, addToGroup } from "../apis/chat";

//logic
import { getSender, getGroupSender } from "../utils/logics";
//Mui imports
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
// import AdbIcon from "@mui/icons-material/Adb";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";

const ENDPOINT = process.env.REACT_APP_SERVER_URL;
let socket;

const settings = ["Add New Group", "Logout"];
function ResponsiveAppBar() {
  const dispatch = useDispatch();
  const { notifications, notificationType, joinLeaveUser } = useSelector((state) => state.chats);
  const { activeUser } = useSelector((state) => state);

  const [newGroups, setNewGroups] = React.useState();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [groupOpen, setGroupOpen] = React.useState(null);
  const [notificationOpen, setNotificationOpen] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenGroups = (event) => {
    setGroupOpen(event.currentTarget);
  };
  const handleCloseGroups = () => {
    setGroupOpen(null);
  };

  const handleOpenNotification = (event) => {
    setNotificationOpen(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setNotificationOpen(null);
  };

  const handleCloseUserMenu = (event) => {
    const selectedSetting = event.currentTarget.textContent;
    if (selectedSetting === "Add New Group") {
      dispatch(setGroupModal(true));
    }
    if(selectedSetting === "Logout"){
      localStorage.removeItem("userToken")
      window.location.href = "/login"
    }
    setAnchorElUser(null);
  };

  const joinGroup = async (event) => {
    const userId = activeUser?.id;
    const chatId = event._id;
    const res = await addToGroup({ userId, chatId });
    console.log(res.user);
    socket.emit("joined group", res.chat, res.user.name, userId);
    const response = await getNewGroups();
    setNewGroups(response);
    dispatch(fetchChats());
    setGroupOpen(null);
  };
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNewGroups();
        setNewGroups(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
React.useEffect(()=>{
  dispatch(fetchChats());
}, [notifications])
  React.useEffect(() => {
    socket = io(ENDPOINT);
  }, []);
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={activeUser?.name} src={activeUser?.profilePic} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Rooms */}

          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            container
            justifyContent="flex-end"
          >
            <Button
              // key={page}

              sx={{ my: 1, color: "white", display: "block" }}
            >
              <IconButton
                size="small"
                aria-label=""
                color="inherit"
                onClick={handleOpenGroups}
              >
                {" "}
                Join Rooms
              </IconButton>
            </Button>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={groupOpen}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={newGroups?.length > 0 ? Boolean(groupOpen) : false}
              onClose={handleCloseGroups}
            >
              {newGroups?.length > 0 ? newGroups.map((e, index) => (
                <MenuItem key={index}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "default",
                    }}
                  >
                    <Typography textAlign="center" sx={{ flex: 1 }}>
                      {e.chatName}
                    </Typography>
                    <Button
                      sx={{ ml: 2, color: "primary" }}
                      onClick={() => joinGroup(e)}
                    >
                      Join
                    </Button>
                  </div>
                </MenuItem>
              )) :''}
            </Menu>
          </Box>

          {/* Notification */}

          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            container
            justifyContent="flex-end"
          >
            <Button
              // key={page}

              sx={{ my: 1, color: "white", display: "block" }}
            >
              <IconButton
                size="small"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleOpenNotification}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Button>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={notificationOpen}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={
                notifications.length > 0 ? Boolean(notificationOpen) : false
              }
              onClose={handleCloseNotification}
            >
              {notifications.map((e, index) => {
                return (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      dispatch(setActiveChat(e.chatId?e.chatId:e));
                      dispatch(
                        setNotifications(
                          notifications.filter((data) => data !== e)
                        )
                      );
                    }}
                  >
                    {/* <Typography textAlign="center">
                      {e.chatId?.isGroup
                        ? `New Message in ${e.chatId.chatName}`
                        : `New Message from ${getSender(
                            activeUser,
                            e.chatId.users
                          )}`}:{`user join ${e.chatName}`}
                    </Typography> */}
                    <Typography textAlign="center">
                      {e.chatId? (e.chatId?.isGroup
                        ? `New Message in ${e.chatId.chatName}`
                        : `New Message from ${getSender(
                            activeUser,
                            e.chatId.users
                          )}`):(notificationType==='join'? `${joinLeaveUser} has joined the ${e.chatName}`: `${joinLeaveUser} has left the ${e.chatName}`)}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
