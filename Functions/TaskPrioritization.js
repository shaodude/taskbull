import dayjs from "dayjs";

// Helper function to calculate days left based on due date
const calculateDaysLeft = (dueDate) => {
  const today = dayjs();
  const taskDate = dayjs(dueDate);

  // Error handling
  if (!taskDate.isValid()) {
    throw new Error(`Invalid date: ${dueDate}`);
  }

  return taskDate.diff(today, "day");
};

// Helper function to find tasks due within 48 hours
const findTasksDueSoon = (tasks) => {
  return tasks.filter((task) => calculateDaysLeft(task.dueDate) <= 2);
};

// Helper function to select tasks based on user motivation
const getChosenTasks = (tasks, userMotivation) => {
  const motivationThreshold = 10;
  let chosenTasks =
    userMotivation >= motivationThreshold
      ? tasks.filter((task) => task.difficulty >= 2) // Hard and Medium tasks
      : tasks.filter((task) => task.difficulty <= 2); // Easy and Medium tasks

  // If there are no tasks of the chosen difficulty, just set chosen tasks to all tasks
  if (chosenTasks.length === 0) {
    chosenTasks = tasks;
  }

  return chosenTasks;
};

// Helper function to calculate the score of a task
const calculateTaskScore = (task, weightedDaysLeft, weightedImportance) => {
  const daysLeft = calculateDaysLeft(task.dueDate);
  const score =
    (1 / (daysLeft + 1)) * weightedDaysLeft +
    task.importance * weightedImportance;
  return score;
};

// Helper function to find the highest scoring task from an array of tasks
const findTopTask = (tasks, weightedDaysLeft, weightedImportance) => {
  let topTask = tasks[0];
  let topTaskScore = calculateTaskScore(
    topTask,
    weightedDaysLeft,
    weightedImportance
  );

  for (let i = 1; i < tasks.length; i++) {
    const currentTask = tasks[i];
    const currentTaskScore = calculateTaskScore(
      currentTask,
      weightedDaysLeft,
      weightedImportance
    );

    if (currentTaskScore > topTaskScore) {
      topTask = currentTask;
      topTaskScore = currentTaskScore;
    }
  }

  return topTask;
};

// Main function to prioritize tasks
export function PrioritizeTask(tasks, userMotivation) {
  // If there are no tasks, return null
  if (tasks.length === 0) {
    return null;
  }

  // get tasks due soon, they have the highest priority
  const tasksDueSoon = findTasksDueSoon(tasks);

  // If there is only one task, return that
  if (tasksDueSoon.length === 1) {
    return tasksDueSoon[0];
  } else if (tasksDueSoon.length > 1) {
    // Sort tasks due within 24 hours by importance and return the most important
    tasksDueSoon.sort((a, b) => b.importance - a.importance);
    return tasksDueSoon[0];
  }

  // No tasks due soon, get tasks of difficulty based on user motivation score
  const chosenTasks = getChosenTasks(tasks, userMotivation);

  // Calculate score for each task based on weight and find the highest scoring task
  const weightedDaysLeft = 0.5;
  const weightedImportance = 4;

  return findTopTask(chosenTasks, weightedDaysLeft, weightedImportance);
}
