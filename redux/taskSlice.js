// tasksSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialTaskState = {
  taskList: [],
  taskSelectedID: null,
  difficultyData: [
    { key: "1", value: "Easy" },
    { key: "2", value: "Medium" },
    { key: "3", value: "Hard" },
  ],
  importanceData: [
    { key: "1", value: "Low" },
    { key: "2", value: "Medium" },
    { key: "3", value: "High" },
  ],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState: initialTaskState,
  reducers: {
    addTask(state, action) {
      state.taskList.push(action.payload);
    },
    deleteTask(state, action) {
      const task = state.taskList.find((task) => task.id === action.payload);
      if (task) {
        task.deleted = true;
      } else {
        console.error("Task not found!");
      }
    },
    setSelectedTaskID(state, action) {
      state.taskSelectedID = action.payload;
    },
    setTaskCompleted(state, action) {
      const task = state.taskList.find((task) => task.id === action.payload.id);
      if (task) {
        task.completed = true;
        task.completedDate = action.payload.dateCreated;
      } else {
        console.error("Task not found!");
      }
    },
    editTask(state, action) {
      const { id, updatedTask } = action.payload;
      const task = state.taskList.find((task) => task.id === id);
      if (task) {
        Object.assign(task, updatedTask);
      } else {
        console.error("Task not found!");
      }
    },
    restoreTask(state, action) {
      const task = state.taskList.find((task) => task.id === action.payload);
      if (task) {
        task.completed = false;
        task.completedDate = "";
        task.deleted = false;
        console.log("Task restored!");
      } else {
        console.error("Task not found!");
      }
    },
    setTaskList(state, action) {
      state.taskList = action.payload ? action.payload : [];
    },
  },
});

export const {
  addTask,
  deleteTask,
  setSelectedTaskID,
  setTaskCompleted,
  editTask,
  restoreTask,
  setTaskList,
} = taskSlice.actions;
export default taskSlice.reducer;
