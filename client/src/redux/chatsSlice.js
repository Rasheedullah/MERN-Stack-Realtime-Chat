import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { toast } from 'react-toastify';
import { fetchAllChats } from '../apis/chat';
const initialState = {
  chats: [],
  activeChat: '',
  isLoading: false,
  notifications: [],
  notificationType:'',
  joinLeaveUser:'',
};
export const fetchChats = createAsyncThunk('redux/chats', async () => {
  try {
    const data = await fetchAllChats();
    return data;
  } catch (error) {
    // toast.error('Something Went Wrong!Try Again');
  }
});
const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, { payload }) => {
      state.activeChat = payload;
    },
    setNotifications: (state, { payload }) => {
      state.notifications = payload;
    },
    setNotificationType: (state, { payload }) => {
      state.notificationType = payload;
    },
    setJoinLeaveUser: (state, { payload }) => {
      state.joinLeaveUser = payload;
    },
  },
extraReducers: (builder) => {
  builder
    .addCase(fetchChats.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchChats.fulfilled, (state, { payload }) => {
      state.chats = payload;
      state.isLoading = false;
    })
    .addCase(fetchChats.rejected, (state) => {
      state.isLoading = false;
    });
},
});
export const { setActiveChat, setNotifications, setNotificationType, setJoinLeaveUser } = chatsSlice.actions;
export default chatsSlice.reducer;
