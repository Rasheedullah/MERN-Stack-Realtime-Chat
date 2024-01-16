// ** Imports
import React, { useState, useEffect, useRef } from "react";

// Redux Imports
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChats,
  setNotifications,
  setNotificationType,
  setJoinLeaveUser,
  setActiveChat,
} from "../redux/chatsSlice";

// APIS Imports
import {
  fetchMessages,
  fetchGroupMessages,
  sendMessage,
} from "../apis/messages";
import { acessCreate } from "../apis/chat.js";
import { validUser } from "../apis/auth";

//Logic
import { isSameSenderMargin } from "../utils/logics";

// Socket imports
import io from "socket.io-client";

// view
import Typing from "../components/Typing";

//date
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// ** M Ui Imports
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";

const MessageArea = styled(List)(({ theme }) => ({
  height: "70vh",
  overflowY: "auto",
  padding: theme.spacing(2),
}));

const SendBox = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ENDPOINT = process.env.REACT_APP_SERVER_URL;
let socket, selectedChatCompare;
dayjs.extend(relativeTime);

function ChatPage() {
  const { activeChat, notifications } = useSelector((state) => state.chats);
  const activeUser = useSelector((state) => state.activeUser);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForm = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (message != "") {
      setMessage("");
      socket.emit("stop typing", activeChat._id);
      const data = await sendMessage({ chatId: activeChat._id, message });
      socket.emit("new message", data);
      setMessages([...messages, data]);
      dispatch(fetchChats());
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.emit("setup", activeUser);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, [messages, activeUser]);
  useEffect(() => {
    const fetchMessagesFunc = async () => {
      if (activeChat) {
        setLoading(true);
        let data = "";
        if (activeChat.isGroup == true) {
          data = await fetchGroupMessages(activeChat._id);
        } else {
          data = await fetchMessages(activeChat._id);
        }
        setMessages(data);
        socket.emit("join room", activeChat._id);
        setLoading(false);
      }
      // setMessages('');
      return;
    };
    fetchMessagesFunc();
    selectedChatCompare = activeChat;
  }, [activeChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        (!selectedChatCompare || selectedChatCompare._id) !==
        newMessageRecieved.chatId._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(setNotifications([newMessageRecieved, ...notifications]));
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
      dispatch(fetchChats());
    });

    socket.on(
      "leaveJoin room recieved",
      (chat, notificationType, joinLeaveUserName) => {
        if ((!selectedChatCompare || selectedChatCompare._id) !== chat._id) {
          if (!notifications.includes(chat)) {
            dispatch(setJoinLeaveUser(joinLeaveUserName));
            dispatch(setNotificationType(notificationType));
            dispatch(setNotifications([chat, ...notifications]));
          }
        }
      }
    );
  });
  const addUser = async (m) => {
    if (m.chatId.isGroup == false || m.sender._id == activeUser.id) return;
    const res = await acessCreate({ userId: m.sender._id });
    console.log(res);
    dispatch(setActiveChat(res[0] ? res[0] : res));
    dispatch(fetchChats());
  };
  const messageAreaRef = useRef(null);
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (!data?.user) {
        window.location.href = "/login";
      }
    };
    isValid();
  }, []);
  return (
    <Grid item xs={9}>
      <MessageArea ref={messageAreaRef}>
        {activeChat ? (
          messages &&
          messages.map((m, i) => (
            <ListItem key={m._id} m={m}>
              <Grid container>
                <Grid item xs={12}>
                  {m.message !== "has joined the group." &&
                  m.message !== "has left the group." ? (
                    <ListItemText
                      align={m.sender._id == activeUser.id ? "right" : "left"}
                    >
                      <Grid item xs={6} onClick={() => addUser(m)}>
                        <IconButton sx={{ p: 0 }}>
                          <Avatar
                            alt={m.sender?.name}
                            src="http/localhost:3000/"
                          />
                        </IconButton>
                      </Grid>
                    </ListItemText>
                  ) : (
                    ""
                  )}
                  {m.message !== "has joined the group." &&
                  m.message !== "has left the group." ? (
                    <ListItemText
                      align={m.sender._id == activeUser.id ? "right" : "left"}
                      primary={m.message}
                    />
                  ) : (
                    <Grid container justify="center">
                      <Grid item xs={12}>
                        <ListItemText align="center" variant="h6">
                          <span style={{ fontSize: "small" }}>
                            {m.sender.name} {m.message}
                          </span>
                        </ListItemText>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                {m.message !== "has joined the group." &&
                m.message !== "has left the group." ? (
                  <Grid item xs={12}>
                    <ListItemText
                      align={m.sender._id == activeUser.id ? "right" : "left"}
                      secondary={dayjs(m.createdAt).fromNow()}
                    />
                  </Grid>
                ) : (
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <ListItemText align="center" variant="h6">
                        <Grid item xs={12}>
                          <ListItemText
                            secondary={dayjs(m.createdAt).fromNow()}
                          />
                        </Grid>
                      </ListItemText>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </ListItem>
          ))
        ) : (
          <Grid container justify="center">
            <Grid item xs={12}>
              <Typography align="center" variant="h4">
                Welcome to Chat App
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <img
                src="http://localhost:3000/b686a70e0151afc1a31dbcb365be5b44.jpg"
                alt="Chat Logo"
                style={{
                  height: "600px",
                  width: "80%",
                  maxWidth: "800px",
                  borderRadius: "15px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                }}
              />
            </Grid>
          </Grid>
        )}
       
      </MessageArea>
      {isTyping ? (
          <ListItem key={33} style={{ marginTop: "" }}>
            <Grid container>
              <Grid item xs={12}>
                <Typing />
              </Grid>
            </Grid>
          </ListItem>
        ) : (
          ""
        )}
      <Divider />
      {activeChat ? (
        <form component="form" onSubmit={(e) => e.preventDefault()}>
          <SendBox container>
            <Grid item xs={11}>
              <TextField
                name="message"
                label="Type Something"
                fullWidth
                variant="outlined"
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (!socketConnected) return;
                  if (!typing) {
                    setTyping(true);
                    socket.emit("typing", activeChat._id);
                  }
                  let lastTime = new Date().getTime();
                  var time = 3000;
                  setTimeout(() => {
                    var timeNow = new Date().getTime();
                    var timeDiff = timeNow - lastTime;
                    if (timeDiff >= time && typing) {
                      socket.emit("stop typing", activeChat._id);
                      setTyping(false);
                    }
                  }, time);
                }}
                value={message}
                autoComplete="off"
              />
            </Grid>
            <Grid xs={1} align="right" onClick={() => handleForm()}>
              <Fab color="primary" aria-label="add">
                <SendIcon />
              </Fab>
            </Grid>
          </SendBox>
        </form>
      ) : (
        <></>
      )}
    </Grid>
  );
}
export default ChatPage;
