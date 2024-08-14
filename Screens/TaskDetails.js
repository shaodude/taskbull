import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, Menu, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";
import * as Calendar from "expo-calendar";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { colors } from "../styles";
import TextIconButton from "../components/TextIconButton";
import { setTaskCompleted, deleteTask, restoreTask } from "../redux/taskSlice";
import { updateUserExp } from "../redux/userSlice";

// Force Portrait mode
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

const TaskDetailsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const darkMode = useSelector((state) => state.user.darkMode);
  const styles = createStyles(darkMode);

  const [optionsVisible, setOptionsVisible] = useState(false);
  const toggleOptionsMenu = () => setOptionsVisible(!optionsVisible);
  const difficultyData = useSelector((state) => state.tasks.difficultyData);
  const importanceData = useSelector((state) => state.tasks.importanceData);
  const taskSelected = useSelector((state) => {
    const taskList = state.tasks.taskList;
    const taskSelectedID = state.tasks.taskSelectedID;
    return taskList.find((task) => task.id === taskSelectedID);
  });

  if (!taskSelected) {
    return <Text>No task selected</Text>;
  }
  const [calendarId, setCalendarId] = useState(null);

  useEffect(() => {
    const getCalendarPermissions = async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        if (Platform.OS === "ios") {
          const nativeCal = await Calendar.getDefaultCalendarAsync();
          setCalendarId(nativeCal.id);
        } else {
          const calendars = await Calendar.getCalendarsAsync(
            Calendar.EntityTypes.EVENT
          );
          const nativeCal = calendars[0];
          setCalendarId(nativeCal.id);
        }
      } else {
        console.log("Calendar permissions not granted");
      }
    };

    getCalendarPermissions();
  }, []);

  const addEventToCalendar = async () => {
    if (!calendarId) {
      console.log("No calendar selected.");
      return;
    }

    const eventDetails = {
      title: taskSelected.title,
      startDate: dayjs(taskSelected.dueDate).startOf("day").toDate(),
      endDate: dayjs(taskSelected.dueDate).endOf("day").toDate(),
      allDay: true,
      notes: taskSelected.remarks,
    };

    try {
      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      console.log("Event created:", eventId);
      Toast.show({
        type: "success",
        text1: "Added to calendar!",
        text2: "Press to dismiss",
        visibilityTime: 3000,
        autoHide: true,
        position: "bottom",
        onPress: () => Toast.hide(),
      });
    } catch (error) {
      console.log("Error creating event:", error);
    }
  };

  const handleMarkComplete = () => {
    const todayString = today.toISOString(); 
    dispatch(setTaskCompleted({id: taskSelected.id, dateCreated: todayString}));
    Toast.show({
      type: "success",
      text1: "Task Completed!",
      text2: "+10 EXP",
      visibilityTime: 3000,
      autoHide: true,
      position: "bottom",
      onPress: () => Toast.hide(),
    });
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate("EditTask");
    setOptionsVisible(false);
  };

  const handleRestore = () => {
    setOptionsVisible(false);
    dispatch(updateUserExp({ operation: "subtract", value: 10 }));
    setTimeout(() => {
      dispatch(restoreTask(taskSelected.id));
    }, 500);
    Toast.show({
      type: "success",
      text1: "Task Restored!",
      text2: "Press to dismiss",
      visibilityTime: 3000,
      autoHide: true,
      position: "bottom",
      onPress: () => Toast.hide(),
    });
  };

  const handleDelete = () => {
    dispatch(deleteTask(taskSelected.id));
    Toast.show({
      type: "info",
      text1: "Task Deleted!",
      text2: "Press to Undo",
      visibilityTime: 3000,
      autoHide: true,
      position: "bottom",
      onPress: handleUndoDelete,
    });
    navigation.goBack();
  };

  const handleUndoDelete = () => {
    dispatch(restoreTask(taskSelected.id));
    Toast.hide();
  };

  const today = dayjs();
  const dueDate = dayjs(taskSelected.dueDate);
  const daysLeft = dueDate.diff(today, "day");

  const importanceLabel =
    importanceData.find((item) => item.key == taskSelected.importance)?.value ||
    "Unknown";
  const difficultyLabel =
    difficultyData.find((item) => item.key == taskSelected.difficulty)?.value ||
    "Unknown";

  const createdDateFormatted = dayjs(taskSelected.dateCreated).format("MMMM D, YYYY");
  const completedDateFormatted = dayjs(taskSelected.completedDate).format("MMMM D, YYYY");

  return (
    <Provider>
      <View style={styles.wrapper}>
        <SafeAreaView edges={["bottom"]} style={styles.safeArea} />

        <ScrollView>
          <View style={styles.container}>
            <View style={styles.topBox}>
              <TouchableOpacity
                style={styles.homeBox}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="arrow-back-circle-outline"
                  size={45}
                  color={darkMode ? colors.darkText : colors.lightText}
                />
              </TouchableOpacity>

              <Menu
                contentStyle={{
                  backgroundColor: darkMode
                    ? colors.darkBackground
                    : colors.lightBackground,
                  borderColor: darkMode
                    ? colors.darkAccent
                    : colors.lightAccent,
                  borderWidth: 1,
                }}
                visible={optionsVisible}
                onDismiss={toggleOptionsMenu}
                anchorPosition={"bottom"}
                anchor={
                  <Ionicons
                    onPress={toggleOptionsMenu}
                    name="ellipsis-horizontal"
                    size={45}
                    color={darkMode ? colors.darkText : colors.lightText}
                  />
                }
              >
                {!taskSelected.completed && !taskSelected.deleted ? (
                  <View>
                    <Menu.Item
                      titleStyle={styles.editOptionText}
                      onPress={handleEdit}
                      title="Edit"
                      leadingIcon={() => (
                        <Ionicons
                          name="create-outline"
                          size={25}
                          color={darkMode ? colors.darkText : colors.lightText}
                        />
                      )}
                    />
                    <Divider
                      style={{
                        backgroundColor: darkMode
                          ? colors.darkAccent
                          : colors.lightAccent,
                      }}
                    />
                    <Menu.Item
                      titleStyle={styles.deleteOptionText}
                      onPress={handleDelete}
                      title="Delete"
                      leadingIcon={() => (
                        <Ionicons
                          name="trash-outline"
                          size={25}
                          color={"crimson"}
                        />
                      )}
                    />
                  </View>
                ) : (
                  <View>
                    <Menu.Item
                      titleStyle={styles.editRestoreText}
                      onPress={handleRestore}
                      title="Restore Task"
                      leadingIcon={() => (
                        <Ionicons
                          name="refresh-outline"
                          size={25}
                          color={"goldenrod"}
                        />
                      )}
                    />
                  </View>
                )}
              </Menu>
            </View>

            <View style={styles.mainBox}>
              <Text style={styles.headerText}>{taskSelected.title}</Text>
            </View>

            <View style={styles.dueDateBox}>
              <Ionicons
                style={{ marginRight: 9 }}
                name="golf-outline"
                size={25}
                color={darkMode ? colors.darkText : colors.lightText}
              />
              {!taskSelected.completed ? (
                <Text style={styles.dateText}>Due in {daysLeft} days</Text>
              ) : (
                <Text style={styles.createdDateText}>
                  Completed on {completedDateFormatted}
                </Text>
              )}
            </View>

            <View style={styles.mainBox}>
              <View style={styles.elementsFirstRow}>
                <View
                  style={{
                    flex: 3,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.smallHeaderText}>Importance</Text>
                  <Ionicons
                    style={{ marginLeft: 9 }}
                    name="podium-outline"
                    size={25}
                    color={darkMode ? colors.darkText : colors.lightText}
                  />
                </View>
                <View style={styles.numberBox}>
                  <Text style={styles.smallerHeaderText}>
                    {importanceLabel}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.mainBox}>
              <View style={styles.elementsSecondRow}>
                <View
                  style={{
                    flex: 3,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.smallHeaderText}>Difficulty</Text>
                  <Ionicons
                    style={{ marginLeft: 9 }}
                    name="speedometer-outline"
                    size={25}
                    color={darkMode ? colors.darkText : colors.lightText}
                  />
                </View>
                <View style={styles.numberBox}>
                  <Text style={styles.smallerHeaderText}>
                    {difficultyLabel}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.mainBox}>
              <Text style={styles.smallHeaderText}>Remarks</Text>
              <View style={styles.subBox}>
                <Text style={styles.innerText}>
                  {taskSelected.remarks.length > 1
                    ? taskSelected.remarks
                    : "NIL"}
                </Text>
              </View>
            </View>

            <View style={styles.mainBox}>
              <Text style={styles.createdDateText}>
                Created on {createdDateFormatted}
              </Text>
            </View>

            {!taskSelected.completed && !taskSelected.deleted && (
              <View style={{ marginTop: 20 }}>
                <TextIconButton
                  icon="checkmark-circle"
                  buttonText="Mark Completed"
                  darkMode={darkMode}
                  onPress={handleMarkComplete}
                />
              </View>
            )}

            <View style={{ marginTop: 30 }}>
              <TextIconButton
                icon="calendar-outline"
                buttonText="Add To Calendar"
                darkMode={darkMode}
                onPress={addEventToCalendar}
                whiteBack={false}
              />
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

    homeBox: {
      marginTop: windowsWidth * 0.1,
    },

    topBox: {
      flex: 1,
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },

    headerText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.17,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 3,
    },

    elementsFirstRow: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "space-between",
    },

    elementsSecondRow: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "space-between",
    },

    numberBox: {
      backgroundColor: darkMode ? colors.darkTint : colors.lightTint,
      padding: 10,
      alignItems: "center",
      borderRadius: 10,
      width: "30%",
    },

    mainBox: {
      width: "100%",
      paddingBottom: 10,
      marginTop: windowsWidth * 0.2,
    },

    dueDateBox: {
      width: "100%",
      paddingBottom: 10,
      marginTop: windowsWidth * 0.2,
      flexDirection: "row",
      alignItems: "flex-end",
    },

    dateText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.13,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    createdDateText: {
      textAlign: "center",
      fontSize: windowsWidth * 0.13,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Italic",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    smallHeaderText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    deleteOptionText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: "crimson",
      fontFamily: "Roboto-Regular",
    },

    smallerHeaderText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.16,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "Roboto-Regular",
    },

    editOptionText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "Roboto-Regular",
    },

    editRestoreText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: "goldenrod",
      fontFamily: "Roboto-Regular",
    },

    subBox: {
      backgroundColor: darkMode ? colors.darkTint : colors.lightTint,
      marginTop: windowsWidth * 0.1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      width: "100%",
      minHeight: 100,
    },

    innerText: {
      width: "100%",
      fontFamily: "Roboto-Light",
      color: darkMode ? colors.darkText : colors.lightText,
      fontSize: windowsWidth * 0.16,
      padding: 20,
    },
  });
  return styles;
};

export default TaskDetailsScreen;
