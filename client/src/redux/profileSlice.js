import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  showProfile: false,
  showNotifications: false,
  groupModal:false
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setShowProfile: (state, { payload }) => {
      state.showProfile = payload;
    },
    setShowNotifications: (state, { payload }) => {
      state.showNotifications = payload;
    },
    setGroupModal: (state, { payload }) => {
      state.groupModal = payload;
    },
  },
});
export const { setShowProfile, setShowNotifications, setGroupModal } = profileSlice.actions;
export default profileSlice.reducer;
