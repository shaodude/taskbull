const isValidPayload = (payload) => {
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
  const missingFields = requiredFields.filter(
    (field) => !payload.hasOwnProperty(field)
  );

  missingFields.forEach((field) => console.warn(`Missing field in payload: ${field}`));

  return missingFields.length === 0;
};

export { isValidPayload };
