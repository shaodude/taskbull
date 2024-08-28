import { PrioritizeTask } from "../TaskPrioritization";
import dayjs from "dayjs";

describe("PrioritizeTask", () => {
  const highUserMotivation = 10;
  const lowUserMotivation = 9;

  test("returns null when there are no tasks", () => {
    expect(PrioritizeTask([], highUserMotivation)).toBeNull();
  });

  test("returns task when there is only one task", () => {
    const taskListwithOneTask = [
      { id: 1, dueDate: "2025-08-15", difficulty: 3, importance: 1 },
    ];
    const result = PrioritizeTask(taskListwithOneTask, highUserMotivation);
    expect(result).toEqual(taskListwithOneTask[0]);
  });

  test("returns task due within 48 hours when there is one", () => {
    const today = dayjs();
    const tomorrow = today.add(1, "day");
    const tomorrowFormatted = tomorrow.format("YYYY-MM-DD");
    const longDueDate = today.add(5, "months");
    const longDueDateFormatted = longDueDate.format("YYYY-MM-DD");

    const tasks = [
      { id: 1, dueDate: longDueDateFormatted, difficulty: 3, importance: 1 },
      { id: 2, dueDate: longDueDateFormatted, difficulty: 1, importance: 3 },
      { id: 3, dueDate: tomorrowFormatted, difficulty: 3, importance: 1 },
    ];
    const result = PrioritizeTask(tasks, highUserMotivation);
    expect(result).toEqual(tasks[2]);
  });

  test("returns the most important task due in 48 hours when there is more than one", () => {
    const today = dayjs();
    const tomorrow = today.add(1, "day");
    const tomorrowFormatted = tomorrow.format("YYYY-MM-DD");
    const longDueDate = today.add(1, "months");
    const longDueDateFormatted = longDueDate.format("YYYY-MM-DD");

    const tasks = [
      { id: 1, dueDate: longDueDateFormatted, difficulty: 3, importance: 1 },
      { id: 2, dueDate: longDueDateFormatted, difficulty: 1, importance: 3 },
      { id: 3, dueDate: tomorrowFormatted, difficulty: 3, importance: 3 },
      { id: 4, dueDate: tomorrowFormatted, difficulty: 3, importance: 1 },
    ];
    const result = PrioritizeTask(tasks, highUserMotivation);
    expect(result).toEqual(tasks[2]);
  });

  test("returns highest scoring Easy task when user is not motivated (<10) there are multiple tasks with none due in 48 hours", () => {
    const today = dayjs();
    const longDueDate = today.add(1, "month");
    const longDueDateFormatted = longDueDate.format("YYYY-MM-DD");

    const tasks = [
      { id: 1, dueDate: longDueDateFormatted, difficulty: 1, importance: 3 },
      { id: 2, dueDate: longDueDateFormatted, difficulty: 1, importance: 1 },
      { id: 3, dueDate: longDueDateFormatted, difficulty: 3, importance: 3 },
      { id: 4, dueDate: longDueDateFormatted, difficulty: 3, importance: 1 },
    ];
    const result = PrioritizeTask(tasks, lowUserMotivation);
    expect(result).toEqual(tasks[0]);
  });

  test("returns highest scoring Difficult task when user is motivated (>=10) there are multiple tasks with none due in 48 hours", () => {
    const today = dayjs();
    const longDueDate = today.add(1, "month");
    const longDueDateFormatted = longDueDate.format("YYYY-MM-DD");

    const tasks = [
      { id: 1, dueDate: longDueDateFormatted, difficulty: 1, importance: 3 },
      { id: 2, dueDate: longDueDateFormatted, difficulty: 1, importance: 1 },
      { id: 3, dueDate: longDueDateFormatted, difficulty: 3, importance: 3 },
      { id: 4, dueDate: longDueDateFormatted, difficulty: 3, importance: 1 },
    ];
    const result = PrioritizeTask(tasks, highUserMotivation);
    expect(result).toEqual(tasks[2]);
  });

  test("throws an error for invalid date", () => {
    const invalidTask = [
      {
        id: 1,
        dueDate: "invalid-date",
        difficulty: 1,
        importance: 3,
      },
    ];
    expect(() => PrioritizeTask(invalidTask, highUserMotivation)).toThrow(
      "Invalid date: invalid-date"
    );
  });
});
