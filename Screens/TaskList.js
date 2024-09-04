import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Provider, List, Divider, Menu } from "react-native-paper";
import dayjs from "dayjs";
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
import { setSelectedTaskID, setTaskCompleted } from "../redux/taskSlice";
import { updateUserExp } from "../redux/userSlice";

// Force Portrait mode
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

const TaskListScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const darkMode = useSelector((state) => state.user.darkMode);
  const styles = createStyles(darkMode);

  const taskList = useSelector((state) => state.tasks.taskList);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const toggleOptionsMenu = () => setOptionsVisible(!optionsVisible);
  const [orderVisible, setOrderVisible] = useState(false);
  const toggleOrderMenu = () => setOrderVisible(!orderVisible);
  const completedTasks = taskList.filter((task) => task.completed);
  const deletedTasks = taskList.filter((task) => task.deleted);
  const [displayTodoTasks, setDisplayTodoTasks] = useState([]);
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [defaultOrder, setDefaultOrder] = useState(null);

  // configure display for task list
  useEffect(() => {
    const outstandingTasks = taskList.filter(
      (task) => !task.completed && !task.deleted
    );
    setDisplayTodoTasks(outstandingTasks);
    setDefaultOrder(outstandingTasks);
  }, [taskList]);

  // handle create task button on click
  const handleCreateTask = () => {
    navigation.navigate("CreateTask");
  };

  // sort tasks based on property and order
  const sortTasks = (property, order) => {
    const sortedTasks = [...displayTodoTasks].sort((a, b) => {
      if (property == "dueDate") {
        const dateA = new Date(a[property]);
        const dateB = new Date(b[property]);
        return order == "ascending" ? dateA - dateB : dateB - dateA;
      } else {
        return order == "ascending"
          ? a[property] - b[property]
          : b[property] - a[property];
      }
    });
    setDisplayTodoTasks(sortedTasks);
    setOptionsVisible(false);
    setOrderVisible(false);
    setSelectedSort(property);
    setSelectedOrder(order);
  };

  const sortByDate = (order) => sortTasks("dueDate", order);
  const sortByImportance = (order) => sortTasks("importance", order);
  const sortByDifficulty = (order) => sortTasks("difficulty", order);
  const orderByAscending = () => sortTasks(selectedSort, "ascending");
  const orderByDescending = () => sortTasks(selectedSort, "descending");

  // revert sort to default
  const sortByDefault = () => {
    setDisplayTodoTasks(defaultOrder);
    setOptionsVisible(false);
    setSelectedSort(null);
    setSelectedOrder(null);
  };

  // show task details
  const showDetails = (index) => {
    dispatch(setSelectedTaskID(index));
    navigation.navigate("TaskDetails");
  };

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

  return (
    <Provider>
      <View style={styles.wrapper}>
        <SafeAreaView edges={["bottom"]} style={styles.safeArea} />

        <ScrollView>
          <View style={styles.container}>
            <View style={styles.topBox}>
              <Text style={styles.headerText}>Task List</Text>
            </View>

            <View style={styles.mainBox}>
              <View style={styles.topBox}>
                <Text style={styles.smallHeaderText}>
                  To Do ({displayTodoTasks.length})
                </Text>
                {/** Acsending/ Descending Menu*/}
                <View
                  style={{ flexDirection: "row", gap: 10, marginRight: 10 }}
                >
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
                    visible={orderVisible}
                    onDismiss={toggleOrderMenu}
                    anchorPosition={"bottom"}
                    anchor={
                      <View>
                        {selectedSort ? (
                          <Ionicons
                            onPress={toggleOrderMenu}
                            name="swap-vertical-outline"
                            size={30}
                            color={
                              selectedOrder
                                ? darkMode
                                  ? colors.darkAccent
                                  : colors.lightAccent
                                : darkMode
                                ? colors.darkText
                                : colors.lightText
                            }
                          />
                        ) : (
                          <Ionicons
                            name="swap-vertical-outline"
                            size={30}
                            color="grey"
                          />
                        )}
                      </View>
                    }
                  >
                    <Menu.Item
                      titleStyle={
                        selectedOrder == "ascending"
                          ? styles.optionTextSelected
                          : styles.optionText
                      }
                      onPress={orderByAscending}
                      title="Ascending"
                      leadingIcon={() => (
                        <View style={{ justifyContent: "center", flex: 1 }}>
                          <Ionicons
                            name="trending-up-outline"
                            size={21}
                            color={
                              selectedOrder == "ascending"
                                ? darkMode
                                  ? colors.darkAccent
                                  : colors.lightAccent
                                : darkMode
                                ? colors.darkText
                                : colors.lightText
                            }
                          />
                        </View>
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
                      titleStyle={
                        selectedOrder == "descending"
                          ? styles.optionTextSelected
                          : styles.optionText
                      }
                      onPress={orderByDescending}
                      title="Descending"
                      leadingIcon={() => (
                        <View style={{ justifyContent: "center", flex: 1 }}>
                          <Ionicons
                            name="trending-down-outline"
                            size={21}
                            color={
                              selectedOrder == "descending"
                                ? darkMode
                                  ? colors.darkAccent
                                  : colors.lightAccent
                                : darkMode
                                ? colors.darkText
                                : colors.lightText
                            }
                          />
                        </View>
                      )}
                    />
                  </Menu>
                  {/** Sort Menu*/}
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
                        name="funnel-outline"
                        size={30}
                        color={
                          selectedSort
                            ? darkMode
                              ? colors.darkAccent
                              : colors.lightAccent
                            : darkMode
                            ? colors.darkText
                            : colors.lightText
                        }
                      />
                    }
                  >
                    <Menu.Item
                      titleStyle={
                        selectedSort == "dueDate"
                          ? styles.optionTextSelected
                          : styles.optionText
                      }
                      onPress={() => sortByDate("ascending")}
                      title="Due Date"
                      leadingIcon={() => (
                        <View style={{ justifyContent: "center", flex: 1 }}>
                          <Ionicons
                            name="calendar-outline"
                            size={21}
                            color={
                              selectedSort == "dueDate"
                                ? darkMode
                                  ? colors.darkAccent
                                  : colors.lightAccent
                                : darkMode
                                ? colors.darkText
                                : colors.lightText
                            }
                          />
                        </View>
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
                      titleStyle={
                        selectedSort == "difficulty"
                          ? styles.optionTextSelected
                          : styles.optionText
                      }
                      onPress={() => sortByDifficulty("descending")}
                      title="Difficulty"
                      leadingIcon={() => (
                        <View style={{ justifyContent: "center", flex: 1 }}>
                          <Ionicons
                            name="speedometer-outline"
                            size={21}
                            color={
                              selectedSort == "difficulty"
                                ? darkMode
                                  ? colors.darkAccent
                                  : colors.lightAccent
                                : darkMode
                                ? colors.darkText
                                : colors.lightText
                            }
                          />
                        </View>
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
                      titleStyle={
                        selectedSort == "importance"
                          ? styles.optionTextSelected
                          : styles.optionText
                      }
                      onPress={() => sortByImportance("descending")}
                      title="Importance"
                      leadingIcon={() => (
                        <View style={{ justifyContent: "center", flex: 1 }}>
                          <Ionicons
                            name="podium-outline"
                            size={21}
                            color={
                              selectedSort == "importance"
                                ? darkMode
                                  ? colors.darkAccent
                                  : colors.lightAccent
                                : darkMode
                                ? colors.darkText
                                : colors.lightText
                            }
                          />
                        </View>
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
                      onPress={sortByDefault}
                      title="Clear Sort"
                      leadingIcon={() => (
                        <View style={{ justifyContent: "center", flex: 1 }}>
                          <Ionicons
                            name="close-circle-outline"
                            size={21}
                            color={"crimson"}
                          />
                        </View>
                      )}
                    />
                  </Menu>
                </View>
              </View>

              <List.Section>
                {displayTodoTasks.length > 0 ? (
                  displayTodoTasks.map((task, index) => (
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
                                    darkMode
                                      ? colors.darkAccent
                                      : colors.lightAccent
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
                  <View>
                    <Text style={styles.greyedText}>No tasks found</Text>
                  </View>
                )}
              </List.Section>

              <List.Section style={{ marginTop: 20 }}>
                <Text style={styles.completedHeaderText}>
                  Completed ({completedTasks.length})
                </Text>
                {completedTasks.length > 0 ? (
                  completedTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      <List.Item
                        title={`${task.title}`}
                        onPress={() => showDetails(task.id)}
                        titleStyle={styles.insideTextSmallGrey}
                      />
                      <Divider bold style={{ backgroundColor: "grey" }} />
                    </React.Fragment>
                  ))
                ) : (
                  <View>
                    <Text style={styles.greyedText}>No tasks found</Text>
                  </View>
                )}
              </List.Section>

              <List.Section style={{ marginTop: 20 }}>
                <Text style={styles.completedHeaderText}>
                  deleted ({deletedTasks.length})
                </Text>
                {deletedTasks.length > 0 ? (
                  deletedTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      <List.Item
                        title={`${task.title}`}
                        onPress={() => showDetails(task.id)}
                        titleStyle={styles.insideTextSmallGrey}
                      />
                      <Divider bold style={{ backgroundColor: "grey" }} />
                    </React.Fragment>
                  ))
                ) : (
                  <View>
                    <Text style={styles.greyedText}>No tasks found</Text>
                  </View>
                )}
              </List.Section>
            </View>
          </View>
        </ScrollView>

        <View style={styles.stickyButton}>
          <TextIconButton
            icon="add-circle"
            buttonText="Create a task"
            darkMode={darkMode}
            onPress={handleCreateTask}
          />
        </View>
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

    insideTextSmall: {
      fontFamily: "Roboto-Light",
      color: darkMode ? colors.darkText : colors.lightText,
      fontSize: windowsWidth * 0.16,
    },

    insideTextSmallGrey: {
      fontFamily: "Roboto-Light",
      color: "grey",
      fontSize: windowsWidth * 0.16,
      marginBottom: windowsWidth * 0.03,
    },

    headerText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.17,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 2,
    },

    smallHeaderText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    completedHeaderText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 5,
    },

    mainBox: {
      width: "100%",
      paddingBottom: 10,
      marginTop: windowsWidth * 0.3,
    },

    stickyButton: {
      width: "60%",
      flex: 1,
      justifyContent: "center",
      alignContent: "center",
      alignSelf: "center",
      position: "absolute",
      bottom: 40,
      backgroundColor: darkMode
        ? colors.darkBackground
        : colors.lightBackground,
      borderRadius: 20,
    },

    topBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 10,
      alignItems: "center",
    },

    optionText: {
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "Roboto-Regular",
    },

    optionTextSelected: {
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkAccent : colors.lightAccent,
      fontFamily: "Roboto-Regular",
    },

    deleteOptionText: {
      fontSize: windowsWidth * 0.14,
      color: "crimson",
      fontFamily: "Roboto-Regular",
      textAlignVertical: "center",
    },

    greyedText: {
      padding: 18,
      fontFamily: "Roboto-Light",
      color: "grey",
      fontSize: windowsWidth * 0.16,
    },
  });
  return styles;
};

export default TaskListScreen;
