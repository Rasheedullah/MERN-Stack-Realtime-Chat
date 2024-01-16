// ** React Import
import React from "react";
import { useEffect } from "react";

// ** Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { setActiveChat, fetchChats } from "../redux/chatsSlice";

// ** util imports
import { getChatName, getChatPhoto } from "../utils/logics";
//date
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// ** M Ui Imports
import { styled } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

dayjs.extend(relativeTime);

const FrientList = () => {
  const { chats, activeChat } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.activeUser);
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <List>
      {chats?.length > 0 ? (
        chats?.map((e) => {
          return (
            <>
              <ListItem
                button
                key={e._id}
                onClick={() => {
                  dispatch(setActiveChat(e));
                }}
              >
                <ListItemIcon>
                  <Avatar
                    alt={getChatName(e, activeUser)}
                    src={getChatPhoto(e, activeUser)}
                  />
                </ListItemIcon>
                {/* <ListItemText variant="h6" primary={getChatName(e, activeUser)}/>
              <ListItemText secondary="online" align="right" />
              <ListItemText variant="body2"  style={{ marginRight: '8px' }} secondary="i was message u yestardy"/> */}
                <ListItemText>
                  <Typography variant="h6" component="div">
                    {getChatName(e, activeUser)}
                  </Typography>
                  <Typography variant="body2" component="div">
                    {/* <span style={{ marginRight: '8px' }}>online</span> */}
                    {e.latestMessage ? (
                      e.latestMessage.message !== "has joined the group." &&
                      e.latestMessage.message !== "has left the group." ? (
                        <span>
                          {e.latestMessage?.message.length > 30
                            ? e.latestMessage?.message.slice(0, 30) + "..."
                            : e.latestMessage?.message}
                        </span>
                      ) : (
                        <span>
                          {e.latestMessage?.message.length > 30
                            ? e.latestMessage?.sender.name + e.latestMessage.message.slice(0, 30) + "..."
                            : e.latestMessage?.sender.name + e.latestMessage.message}
                        </span>
                      )
                    ) : (
                      ""
                    )}
                  </Typography>
                </ListItemText>
                <ListItemText
                  secondary={dayjs(e.updatedAt).fromNow()}
                  align="right"
                />
              </ListItem>
            </>
          );
        })
      ) : (
        <ListItemText
          primary="No Friend Found!"
          style={{ marginLeft: "37px" }}
        />
      )}
    </List>
  );
};

export default FrientList;
