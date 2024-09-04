import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChessPawn,
  faChessKnight,
  faChessBishop,
  faChessRook,
  faChessQueen,
  faChessKing,
} from "@fortawesome/free-solid-svg-icons";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { List, Divider } from "react-native-paper";
import { setSelectedTaskID, setTaskCompleted } from "../redux/taskSlice";
import {
  updateUserExp,
  incrementLoginStreak,
  setUserMotivation,
  setLastLoginDate,
  resetLoginStreak,
  updateUserData,
  setLastSynced,
} from "../redux/userSlice";
import { PrioritizeTask } from "../Functions/TaskPrioritization";
import { colors } from "../styles";

// Force Potrait mode
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const darkMode = useSelector((state) => state.user.darkMode);
  const styles = createStyles(darkMode);
  const ranks = useSelector((state) => state.user.ranks);
  const username = useSelector((state) => state.user.userName);
  const userExp = useSelector((state) => state.user.userExp);
  const loginStreak = useSelector((state) => state.user.loginStreak);
  const taskList = useSelector((state) => state.tasks.taskList);
  const outstandingTasks = taskList.filter(
    (task) => !task.completed && !task.deleted
  );

  const currentRank = ranks.find(
    (rank) => userExp >= rank.minExp && userExp <= rank.maxExp
  );
  const [greeting, setGreeting] = useState("Welcome");
  const tasksCompletedRecently = taskList.filter((task) => {
    if (!task.completed || task.deleted) {
      return false;
    }

    const completedDate = dayjs(task.completedDate);
    const today = dayjs();
    const diffInDays = today.diff(completedDate, "day");
    return diffInDays <= 7 && diffInDays >= 0;
  });

  const userMotivation = useSelector((state) => state.user.userMotivation);

  const tasksDueSoon = outstandingTasks.filter((task) => {
    const dueDate = dayjs(task.dueDate);
    const today = dayjs();
    return (
      !task.completed &&
      dueDate.diff(today, "day") < 7 &&
      dueDate.diff(today, "day") >= 0
    );
  });
  const showDetails = (index) => {
    dispatch(setSelectedTaskID(index));
    navigation.navigate("TaskDetails");
  };

  // get prioritized task
  const prioritizedTask = PrioritizeTask(outstandingTasks, userMotivation);
  const isInitialized = useSelector((state) => state.user.status);
  const lastLoginDate = useSelector((state) => state.user.lastLoginDate);

  // runs at application start,
  // 1) reward user with daily exp
  // 2) increase login streak if relevant
  // 3) set greeting message according to time of day
  useEffect(() => {
    // if api is not yet loaded, do not run this block
    if (isInitialized != "initialized") {
      return;
    }

    // check last login date and update login streak
    const today = dayjs();
    const lastLogin = dayjs(lastLoginDate);
    const diffInDays = today.diff(lastLogin, "day");
    if (!lastLogin.isSame(today, "day")) {
      if (diffInDays > 1) {
        dispatch(resetLoginStreak());
        console.log("Reset daily streak!");
      } else {
        dispatch(incrementLoginStreak());
        console.log("Incremented daily streak!");
      }
      if (loginStreak >= 3) {
        dispatch(updateUserExp({ operation: "add", value: 30 }));
      } else {
        dispatch(updateUserExp({ operation: "add", value: 10 }));
      }

      console.log("Awarded daily exp and updated login date!");

      Toast.show({
        type: "success",
        text1: "Daily EXP award!",
        text2: "+20 EXP",
        visibilityTime: 3000,
        autoHide: true,
        position: "bottom",
        onPress: () => Toast.hide(),
      });
    }
    const todayString = today.toISOString();
    dispatch(setLastLoginDate(todayString));
    dispatch(setLastSynced(todayString));
    dispatch(updateUserData());
    console.log("Daily exp has already been awarded for today!");

    // get current device time
    const curHr = today.hour();

    if (curHr < 12) {
      setGreeting("Good Morning");
    } else if (curHr < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [dispatch, isInitialized]);

  // Calculate user motivation and set redux state
  useEffect(() => {
    const tasksCompletedRecently = taskList.filter((task) => {
      if (!task.completed || task.deleted) {
        return false;
      }

      const completedDate = dayjs(task.completedDate);
      const today = dayjs();
      const diffInDays = today.diff(completedDate, "day");
      return diffInDays <= 7 && diffInDays >= 0;
    });

    // user motivation score is based on tasks completed recently
    const motivationScore = tasksCompletedRecently.reduce((total, task) => {
      return parseInt(total) + parseInt(task.difficulty);
    }, 0);

    dispatch(setUserMotivation(motivationScore));
  }, [dispatch, taskList]);

  const handleMarkComplete = (id) => {
    const today = dayjs();
    const todayString = today.toISOString();
    dispatch(setTaskCompleted({ id: id, dateCreated: todayString }));
    dispatch(updateUserExp({ operation: "add", value: 10 }));
    Toast.show({
      type: "success",
      text1: "Task Completed!",
      text2: "+10 EXP",
      visibilityTime: 3000,
      autoHide: true,
      position: "bottom",
      onPress: () => Toast.hide(),
    });
  };

  // link database rank icon to file's import (need to be improved)
  const iconMap = {
    "chess-pawn": faChessPawn,
    "chess-knight": faChessKnight,
    "chess-bishop": faChessBishop,
    "chess-rook": faChessRook,
    "chess-queen": faChessQueen,
    "chess-king": faChessKing,
  };

  function GreetingMessage() {
    return (
      <View style={styles.welcomeBox}>
        <View style={{ flex: 4, justifyContent: "center" }}>
          <Text style={styles.welcomeText}>
            {greeting}, {username}
          </Text>
        </View>
      </View>
    );
  }

  function CreateTaskButton() {
    return (
      <TouchableOpacity
        style={styles.stickyButton}
        onPress={() => {
          navigation.navigate("CreateTask");
        }}
      >
        <View>
          <Ionicons
            style={{ position: "absolute" }}
            name="ellipse"
            size={55}
            color={colors.darkText}
          />
          <Ionicons
            name="add-circle"
            size={55}
            color={darkMode ? colors.darkAccent : colors.lightAccent}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function RecommendedTask() {
    return (
      <View style={styles.topBox}>
        <Text style={styles.headerText}>Recommended Task</Text>
        {prioritizedTask ? (
          <View style={styles.recTaskDisplayBox}>
            <List.Item
              left={() => (
                <View>
                  <TouchableOpacity
                    onPress={() => handleMarkComplete(prioritizedTask.id)}
                  >
                    <Ionicons
                      style={{ position: "absolute" }}
                      name="ellipse"
                      size={25}
                      color={colors.darkText}
                    />
                    <Ionicons
                      name="checkmark-circle"
                      size={25}
                      color={darkMode ? colors.darkAccent : colors.lightAccent}
                    />
                  </TouchableOpacity>
                </View>
              )}
              style={{
                flex: 1,
                flexDirection: "row",
                alignContent: "center",
              }}
              title={prioritizedTask.title}
              onPress={() => showDetails(prioritizedTask.id)}
              titleStyle={styles.insideTextSmall}
            />
          </View>
        ) : (
          <View style={styles.recTaskDisplayBox}>
            <Text
              style={{
                padding: 18,
                color: "grey",
              }}
            >
              No tasks found
            </Text>
          </View>
        )}
      </View>
    );
  }

  function PersonalStats() {
    return (
      <View style={styles.mainBox}>
        <Text style={styles.headerText}>My Stats</Text>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate("Game")}
        >
          <View style={styles.personalStatsBox}>
            {currentRank && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesomeIcon
                  icon={iconMap[currentRank.icon]}
                  size={25}
                  color={darkMode ? colors.darkAccent : colors.lightAccent}
                />

                <View style={{ paddingLeft: 10 }}>
                  <Text style={styles.insideTextSmall}>
                    {currentRank.title}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.personalStatsBox}>
            <Ionicons
              name="prism"
              size={25}
              color={darkMode ? colors.darkAccent : colors.lightAccent}
            />
            <View style={{ paddingLeft: 10 }}>
              <Text style={styles.insideTextSmall}>
                {tasksCompletedRecently.length} Tasks completed this week
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Ionicons
              name="flame"
              size={25}
              color={darkMode ? colors.darkAccent : colors.lightAccent}
            />
            <View style={{ paddingLeft: 10 }}>
              <Text style={styles.insideTextSmall}>
                {loginStreak} Days login streak
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function TasksDueSoon() {
    return (
      <View style={styles.mainBox}>
        <Text style={styles.headerText}>tasks due soon</Text>
        {tasksDueSoon.length > 0 ? (
          tasksDueSoon.map((task, index) => (
            <React.Fragment key={task.id}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <List.Item
                  left={() => (
                    <View>
                      <TouchableOpacity
                        onPress={() => handleMarkComplete(task.id)}
                      >
                        <Ionicons
                          style={{ position: "absolute" }}
                          name="ellipse"
                          size={25}
                          color={colors.darkText}
                        />
                        <Ionicons
                          name="checkmark-circle"
                          size={25}
                          color={
                            darkMode ? colors.darkAccent : colors.lightAccent
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  style={{ flex: 1 }}
                  title={`${task.title}`}
                  onPress={() => showDetails(task.id)}
                  titleStyle={styles.insideTextSmall}
                />
              </View>
              <Divider
                bold
                style={{
                  backgroundColor: darkMode
                    ? colors.darkAccent
                    : colors.lightAccent,
                }}
              />
            </React.Fragment>
          ))
        ) : (
          <View style={{ padding: 10 }}>
            <Text style={styles.greyTextSmall}>No tasks due soon</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView edges={["bottom"]} style={styles.safeArea} />

      <CreateTaskButton />

      <ScrollView>
        <View style={styles.container}>
          <GreetingMessage />
          <RecommendedTask />
          <PersonalStats />
          <TasksDueSoon />
        </View>
      </ScrollView>
    </View>
  );
};

const windowsWidth = Dimensions.get("window").width / 4;

const createStyles = (darkMode) => {
  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: darkMode
        ? colors.darkBackground
        : colors.lightBackground,
    },

    container: {
      flex: 1,
      alignItems: "center",
      paddingVertical: windowsWidth * 0.1,
      paddingHorizontal: windowsWidth * 0.2,
    },

    safeArea: {
      padding:
        Platform.OS === "ios" ? windowsWidth * 0.04 : windowsWidth * 0.18,
    },

    stickyButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-end",
      position: "absolute",
      right: 15,
      top: windowsWidth * 0.45,
      zIndex: 10,
    },

    welcomeBox: {
      flexDirection: "row",
      width: "100%",
      alignContent: "space-between",
      justifyContent: "center",
      marginTop: windowsWidth * 0.1,
    },

    welcomeText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.19,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Bold",
    },

    mainBox: {
      width: "100%",
      paddingBottom: windowsWidth * 0.15,
      paddingTop: windowsWidth * 0.2,
    },

    topBox: {
      flex: 1,
      width: "100%",
      paddingBottom: windowsWidth * 0.15,
      paddingTop: windowsWidth * 0.4,
    },

    recTaskDisplayBox: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      borderColor: darkMode ? colors.darkAccent : colors.lightAccent,
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginTop: 10,
    },

    personalStatsBox: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingVertical: 10,
    },

    insideTextSmall: {
      fontFamily: "Roboto-Light",
      color: darkMode ? colors.darkText : colors.lightText,
      fontSize: windowsWidth * 0.16,
    },

    greyTextSmall: {
      fontFamily: "Roboto-Light",
      color: "grey",
      fontSize: windowsWidth * 0.16,
      marginBottom: windowsWidth * 0.03,
    },

    headerText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 2,
    },
  });
  return styles;
};

export default HomeScreen;
