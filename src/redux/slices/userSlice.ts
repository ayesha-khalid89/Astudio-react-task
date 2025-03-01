// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../utils/interface";

interface UserState {
  users: User[];
  totalUsers: number;
  userPageSize: number;
}

const initialState: UserState = {
  users: [],
  totalUsers: 0,
  userPageSize: 5,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setTotalUsers: (state, action: PayloadAction<number>) => {
      state.totalUsers = action.payload;
    },
    setUserPageSize: (state, action: PayloadAction<number>) => {
      state.userPageSize = action.payload;
    },
  },
});

export const { setUsers, setTotalUsers, setUserPageSize } = userSlice.actions;
export default userSlice.reducer;
