import { differenceInDays, parseISO, isValid } from 'date-fns';

// Helper function to calculate days left based on due date
const calculateDaysLeft = (dueDate) => {
  const today = new Date();
  const taskDate = parseISO(dueDate);

  // Error handling 
  if (!isValid(taskDate)) {
    throw new Error(`Invalid date: ${dueDate}`);
  }

  return differenceInDays(taskDate, today);
};

// Helper function to find tasks due within 24 hours
const findTasksDueSoon = (tasks) => {
  return tasks.filter(task => calculateDaysLeft(task.dueDate) <= 1);
};

// Helper function to select tasks based on user motivation
const getChosenTasks = (tasks, userMotivation) => {
  let chosenTasks = userMotivation >= 10
    ? tasks.filter(task => task.difficulty === 'Hard')
    : tasks.filter(task => task.difficulty === 'Easy');

  // If there are no tasks of the chosen difficulty, just set chosen tasks to all tasks
  if (chosenTasks.length === 0) {
    chosenTasks = tasks;
  }

  return chosenTasks;
};

// Helper function to calculate the score of a task
const calculateTaskScore = (task, weightedDaysLeft, weightedImportance) => {
  const daysLeft = calculateDaysLeft(task.dueDate);
  const score = (1 / (daysLeft + 1) * weightedDaysLeft) + (task.importance * weightedImportance);
  return score;
};

// Helper function to find the highest scoring task
const findTopTask = (tasks, weightedDaysLeft, weightedImportance) => {
  let topTask = tasks[0];
  let topTaskScore = calculateTaskScore(topTask, weightedDaysLeft, weightedImportance);

  for (let i = 1; i < tasks.length; i++) {
    const currentTask = tasks[i];
    const currentTaskScore = calculateTaskScore(currentTask, weightedDaysLeft, weightedImportance);

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

  // Find tasks due within 24 hours
  const tasksDueSoon = findTasksDueSoon(tasks);

  // If there is only one task, return that
  if (tasksDueSoon.length === 1) {
    return tasksDueSoon[0];
  } else if (tasksDueSoon.length > 1) {
    // Sort tasks due within 24 hours by importance and return the most important
    tasksDueSoon.sort((a, b) => b.importance - a.importance);
    return tasksDueSoon[0];
  }

  // No tasks due within 24 hours, get tasks with difficulty based on user motivation score
  const chosenTasks = getChosenTasks(tasks, userMotivation);

  // Calculate score for each task based on weight and find the highest scoring task
  const weightedDaysLeft = 1;
  const weightedImportance = 3; 

  return findTopTask(chosenTasks, weightedDaysLeft, weightedImportance);
}



