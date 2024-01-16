// ** React Imports
import React , {useEffect, useState} from 'react';

// ** Apis
import { searchUsers, validUser } from '../apis/auth'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { setActiveUser } from '../redux/activeUserSlice'

// ** view 
import SearchUserList  from '../components/Search';
import FriendList  from '../components/FriendList';
import ChatPage  from './Chat';
import AppBar  from '../components/AppBar';
import GroupModal  from '../components/GroupModal';
import ChatHeader  from '../components/ChatHeader';

// ** M Ui Imports
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


const IndexPage = () => {
  const dispatch = useDispatch()
  const { showProfile, showNotifications } = useSelector((state) => state.profile)
  const { notifications } = useSelector((state) => state.chats)
  const { activeUser } = useSelector((state) => state)
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)




  useEffect(() => {
    const isValid = async () => {
      const data = await validUser()

      const user = {
        id: data?.user?._id,
        email: data?.user?.email,
        profilePic: data?.user?.profilePic,
        bio: data?.user?.bio,
        name: data?.user?.name
      }
      dispatch(setActiveUser(user))
    }
    isValid()

  }, [dispatch, activeUser])
  return (
    <div>
      <GroupModal/>
      <Grid container>
        {/* <Grid item xs={6}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
        <Grid item xs={6}  container
            justifyContent="flex-end">
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid> */}
        <ChatHeader/>
      </Grid>
      <ChatSection container component={ChatPaper}>
        {/* <Grid  item xs={3} style={{ borderRight: '1px solid white', position: 'relative'}}> */}
        <Grid  item xs={3} style={{ borderRight: '1px solid rgb(206 200 194)', position: 'relative'}} >
          {/* <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar alt="Remy Sharp" src={activeUser?.profilePic}/>
              </ListItemIcon>
              <ListItemText primary={activeUser?.name} />
              <ListItemIcon>Setting</ListItemIcon>
            </ListItem>
          </List> */}
          <AppBar/>

          <Divider />
          <Grid item xs={12} style={{ padding: '15px' }}>
            {/* <SearchTextField label="Search" variant="outlined" fullWidth /> */}
            <SearchUserList/>
          </Grid>
          <Divider />
          {/* Friend List */}
          <FriendList/>
          {/* <List>
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
          </List> */}
        </Grid>
        {/* chat Grid */}
        <ChatPage/>
      </ChatSection>
    </div>
  );
};

export default IndexPage;
