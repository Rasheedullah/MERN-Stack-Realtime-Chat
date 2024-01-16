import React from 'react';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';

const ChatPaper = styled(Paper)(({ theme }) => ({
  height: '80vh',
  width: '100%',
  overflow: 'hidden',
}));

const ChatSection = styled(Grid)(({ theme }) => ({
  height: '100%',
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
//   padding: theme.spacing(2),
}));

const MessageArea = styled(List)(({ theme }) => ({
  height: '70vh',
  overflowY: 'auto',
  padding: theme.spacing(2),
}));

const SendBox = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ChatPage = () => {
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <ChatSection container component={ChatPaper}>
        {/* <Grid  item xs={3} style={{ borderRight: '1px solid white', position: 'relative'}}> */}
        <Grid  item xs={3} style={{ borderRight: '1px solid rgb(206 200 194)'}}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
              </ListItemIcon>
              <ListItemText primary="John Wick" />
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: '15px' }}>
            <SearchTextField label="Search" variant="outlined" fullWidth />
          </Grid>
          <Divider />
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
              </ListItemIcon>
              <ListItemText primary="Remy Sharp" />
              <ListItemText secondary="online" align="right" />
            </ListItem>
            <ListItem button key="Alice">
              <ListItemIcon>
                <Avatar alt="Alice" src="https://mui.com/static/images/avatar/3.jpg" />
              </ListItemIcon>
              <ListItemText primary="Alice" />
            </ListItem>
            <ListItem button key="CindyBaker">
              <ListItemIcon>
                <Avatar alt="Cindy Baker" src="https://mui.com/static/images/avatar/2.jpg" />
              </ListItemIcon>
              <ListItemText primary="Cindy Baker" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={9}>
          <MessageArea>
            <ListItem key="1">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText align="right" primary="Hey man, What's up ?" />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText align="right" secondary="09:30" />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem key="2">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText align="left" primary="Hey, I am Good! What about you ?" />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText align="left" secondary="09:31" />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem key="3">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText align="right" primary="Cool. I am good, let's catch up!" />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText align="right" secondary="10:30" />
                </Grid>
              </Grid>
            </ListItem>
          </MessageArea>
          <Divider />
          <SendBox container>
            <Grid item xs={11}>
              <TextField label="Type Something" fullWidth variant="outlined" />
            </Grid>
            <Grid xs={1} align="right">
              <Fab color="primary" aria-label="add">
                <SendIcon />
              </Fab>
            </Grid>
          </SendBox>
        </Grid>
      </ChatSection>
    </div>
  );
};

export default ChatPage;
