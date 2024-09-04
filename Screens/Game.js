import { useSelector } from "react-redux";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, Avatar, ProgressBar } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import dayjs from "dayjs";
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
  Platform,
  Dimensions,
} from "react-native";
import { colors } from "../styles";

// Force Portrait mode
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

const GameScreen = () => {
  const darkMode = useSelector((state) => state.user.darkMode);
  const styles = createStyles(darkMode);
  const loginStreak = useSelector((state) => state.user.loginStreak);
  const taskList = useSelector((state) => state.tasks.taskList);
  const userMotivation = useSelector((state) => state.user.userMotivation);
  const tasksCompletedRecently = taskList.filter((task) => {
    if (!task.completed || task.deleted) {
      return false;
    }

    const completedDate = dayjs(task.completedDate);
    const today = dayjs();
    const diffInDays = today.diff(completedDate, "day");
    return diffInDays <= 7 && diffInDays >= 0;
  });
  const tasksCompletedLifetime = taskList.filter((task) => {
    return task.completed && !task.deleted;
  });

  // link database rank icon to file's import (can be improved)
  const iconMap = {
    "chess-pawn": faChessPawn,
    "chess-knight": faChessKnight,
    "chess-bishop": faChessBishop,
    "chess-rook": faChessRook,
    "chess-queen": faChessQueen,
    "chess-king": faChessKing,
  };

  const userExp = useSelector((state) => state.user.userExp);
  const ranks = useSelector((state) => state.user.ranks);
  const currentRank = ranks.find(
    (rank) => userExp >= rank.minExp && userExp <= rank.maxExp
  );

  // find the next rank based on the current rank
  const currentIndex = ranks.findIndex((rank) => rank === currentRank);
  const nextRank = ranks[currentIndex + 1];

  // calculate the progress value between 0 and 1
  const progress =
    currentRank && nextRank
      ? (userExp - currentRank.minExp) / (nextRank.minExp - currentRank.minExp)
      : 1;

  const expToNextRank = nextRank ? nextRank.minExp - userExp : 0;
  return (
    <Provider>
      <View style={styles.wrapper}>
        <SafeAreaView edges={["bottom"]} style={styles.safeArea} />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.settingBox}>
              <View style={{ justifyContent: "center" }}>
                <Text style={styles.headerText}>my stats</Text>
              </View>
            </View>

            <View style={{ borderRadius: 100, marginTop: 30 }}>
              <Avatar.Icon
                size={130}
                style={{
                  backgroundColor: darkMode
                    ? colors.darkAccent
                    : colors.lightAccent,
                }}
                icon={() => (
                  <FontAwesomeIcon
                    icon={iconMap[currentRank.icon]}
                    size={80}
                    color={colors.darkText}
                  />
                )}
              />
            </View>
            <View style={styles.titleBox}>
              <Text style={styles.titleHeaderText}>title</Text>
              <View style={styles.titleDisplayBox}>
                <Text style={styles.bigHeaderText}>{currentRank.title}</Text>
              </View>
            </View>

            <View style={styles.expBox}>
              <ProgressBar
                progress={progress}
                color={darkMode ? colors.darkAccent : colors.lightAccent}
              />
              <Text style={styles.subHeaderText}>
                {expToNextRank} exp to next rank
              </Text>
            </View>

            <View style={styles.statsBox}>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subHeaderText}>Daily Login streak</Text>
                <Text style={styles.numberHeaderText}>{loginStreak}</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subHeaderText}>
                  Tasks Completed this week
                </Text>
                <Text style={styles.numberHeaderText}>
                  {tasksCompletedRecently.length}
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subHeaderText}>Motivation Score</Text>
                <Text style={styles.numberHeaderText}>{userMotivation}</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subHeaderText}>
                  Lifetime Tasks Completed
                </Text>
                <Text style={styles.numberHeaderText}>
                  {tasksCompletedLifetime.length}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Provider>
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

    headerText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.17,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    titleHeaderText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.17,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
      textDecorationLine: "underline",
    },

    bigHeaderText: {
      textAlign: "center",
      fontSize: windowsWidth * 0.18,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 2,
    },

    numberHeaderText: {
      textAlign: "center",
      fontSize: windowsWidth * 0.3,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
      paddingTop: 5,
    },

    subHeaderText: {
      marginTop: 10,
      textAlign: "center",
      fontSize: windowsWidth * 0.13,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
    },

    settingBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 10,
    },

    titleDisplayBox: {
      marginTop: 15,
      width: "90%",
      justifyContent: "center",
      alignItems: "center",
    },

    titleBox: {
      marginTop: 30,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      width: "100%",
    },

    expBox: {
      width: "60%",
      marginTop: 25,
      justifyContent: "center",
    },

    statsBox: {
      width: "100%",
      marginTop: 25,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return styles;
};

export default GameScreen;
