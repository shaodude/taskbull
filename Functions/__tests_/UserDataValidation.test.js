import { isValidPayload } from "../UserDataValidation";

describe("isValidPayload", () => {
  test("returns true when all required fields are present", () => {
    const validPayload = {
      nextTaskId: 1,
      userExp: 100,
      loginStreak: 5,
      lastLoginDate: "2024-08-14",
      userName: "testuser",
      darkMode: true,
      lastSynced: "2024-08-14T10:00:00Z",
      tasks: [],
    };

    expect(isValidPayload(validPayload)).toBe(true);
  });

  test("returns false when some required fields are missing", () => {
    const invalidPayload = {
      nextTaskId: 1,
      userExp: 100,
      lastLoginDate: "2024-08-14",
      userName: "testuser",
      darkMode: true,
      lastSynced: "2024-08-14T10:00:00Z",
    };

    expect(isValidPayload(invalidPayload)).toBe(false);
  });

  test("logs a warning for each missing field", () => {
    const invalidPayload = {
      nextTaskId: 1,
      userExp: 100,
      lastLoginDate: "2024-08-14",
      userName: "testuser",
      darkMode: true,
      lastSynced: "2024-08-14T10:00:00Z",
    };

    console.warn = jest.fn();

    isValidPayload(invalidPayload);

    expect(console.warn).toHaveBeenCalledWith(
      "Missing field in payload: loginStreak"
    );
    expect(console.warn).toHaveBeenCalledWith(
      "Missing field in payload: tasks"
    );
  });

  test("returns false when none of the required fields are present", () => {
    const invalidPayload = {};

    expect(isValidPayload(invalidPayload)).toBe(false);
  });

  test("logs warnings when none of the required fields are present", () => {
    const invalidPayload = {};

    console.warn = jest.fn(); 

    isValidPayload(invalidPayload);

    const requiredFields = [
      "nextTaskId",
      "userExp",
      "loginStreak",
      "lastLoginDate",
      "userName",
      "darkMode",
      "lastSynced",
      "tasks",
    ];

    requiredFields.forEach((field) => {
      expect(console.warn).toHaveBeenCalledWith(
        `Missing field in payload: ${field}`
      );
    });
  });
});
