import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../utils/interface";

interface IUserState {
  users: IUser[];
  totalUsers: number;
  userPageSize: number;
}

const initialState: IUserState = {
  users: [],
  totalUsers: 0,
  userPageSize: 5,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUser[]>) => {
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
