import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserData, postUserData } from "../apis/UserAPI";
import { setTaskList } from "./taskSlice";
import { isValidPayload } from "../Functions/UserDataValidation";
import fallbackData from "../apis/fallbackData.json";

const initialUserState = {
  userMotivation: null,
  darkMode: null,
  userName: null,
  userExp: null,
  lastLoginDate: null,
  loginStreak: null,
  nextTaskId: null,
  userId: "VwluITXKsWrvtPfrusis",
  lastSynced: null,
  ranks: [],
  status: "idle",
  error: null,
};

// get user data
export const fetchUserData = createAsyncThunk(
  "user/getUserData",

  async (arg, thunkAPI) => {
    const state = thunkAPI.getState();
    const userId = state.user.userId
    const data = await getUserData(userId);

    // Validate the payload
    if (!isValidPayload(data)) {
      console.warn("Invalid payload, using fallback data");
      thunkAPI.dispatch(setTaskList(fallbackData.tasks));
      return fallbackData;
    } else {
      thunkAPI.dispatch(setTaskList(data.tasks));
      return data;
    }
  }
);

// update user data when first initialised
export const updateUserData = createAsyncThunk(
  "user/updateUserData",

  async (arg, thunkAPI) => {
    const state = thunkAPI.getState();
    const userId = state.user.userId
    const tasks = state.tasks.taskList;
    const data = {
      userName: state.user.userName,
      userExp: state.user.userExp,
      darkMode: state.user.darkMode,
      lastLoginDate: state.user.lastLoginDate,
      loginStreak: state.user.loginStreak,
      lastSynced: state.user.lastSynced,
      nextTaskId: state.user.nextTaskId,
      tasks: tasks,
    };
    await postUserData(userId, data);
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUserMotivation(state, action) {
      state.userMotivation = action.payload;
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload;
    },
    setUserName(state, action) {
      state.userName = action.payload;
    },
    updateUserExp(state, action) {
      const { operation, value } = action.payload;
      if (operation === "add") {
        state.userExp += value;
      } else if (operation === "subtract") {
        state.userExp -= value;
      }
    },
    setLastLoginDate(state, action) {
      state.lastLoginDate = action.payload;
    },
    incrementLoginStreak(state) {
      state.loginStreak += 1;
    },
    resetLoginStreak(state) {
      state.loginStreak = 1;
    },
    setLoginStreak(state, action) {
      state.loginStreak = action.payload;
    },
    setUserExp(state, action) {
      state.userExp = action.payload;
    },
    setNextTaskId(state, action) {
      state.nextTaskId = action.payload;
    },
    incrementNextTaskId(state) {
      state.nextTaskId += 1;
    },
    setLastSynced(state, action) {
      state.lastSynced = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const data = isValidPayload(action.payload)
        ? action.payload
        : fallbackData;
      state.nextTaskId = data.nextTaskId;
      state.userExp = data.userExp;
      state.loginStreak = data.loginStreak;
      state.lastLoginDate = data.lastLoginDate;
      state.userName = data.userName;
      state.darkMode = data.darkMode;
      state.lastSynced = data.lastSynced;
      state.ranks = data.rank
      state.status = "initialized";
    });
  },
});

export const {
  setUserMotivation,
  setDarkMode,
  setUserName,
  setLastLoginDate,
  updateUserExp,
  incrementLoginStreak,
  resetLoginStreak,
  incrementNextTaskId,
  setLastSynced,
} = userSlice.actions;

export default userSlice.reducer;
