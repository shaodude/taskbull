import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Provider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import Toast from "react-native-toast-message";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
} from "react-native";
import { colors } from "../styles";
import { editTask } from "../redux/taskSlice";
import TextIconButton from "../components/TextIconButton";

// Force Portrait mode
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

const EditTaskScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const darkMode = useSelector((state) => state.user.darkMode);
  const styles = createStyles(darkMode);

  const taskSelected = useSelector((state) => {
    const taskList = state.tasks.taskList;
    const taskSelectedID = state.tasks.taskSelectedID;
    return taskList.find((task) => task.id === taskSelectedID);
  });

  const [title, onChangeTitle] = useState("");
  const [date, setDate] = useState(dayjs());
  const [dateModalVisible, setdateModalVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedImportance, setSelectedImportance] = useState("");
  const [remarks, onChangeRemarks] = useState("");

  const toggleDatepicker = () => setdateModalVisible(!dateModalVisible);
  const difficultyData = useSelector((state) => state.tasks.difficultyData);
  const importanceData = useSelector((state) => state.tasks.importanceData);

  // prevent excessive rerenders which cause page to freeze
  useEffect(() => {
    if (taskSelected) {
      onChangeTitle(taskSelected.title);
      setDate(dayjs(taskSelected.dueDate));
      setSelectedDifficulty(taskSelected.difficulty);
      setSelectedImportance(taskSelected.importance);
      onChangeRemarks(taskSelected.remarks);
    }
  }, [taskSelected]);

  // Define error state object
  const [errors, setErrors] = useState({
    title: null,
    remarks: null,
  });

  const validateFields = () => {
    const illegalChars = /[<>/\\"';\*|^~{}\[\]]/;
    const newErrors = {};

    if (remarks.trim().length > 0 && illegalChars.test(remarks.trim())) {
      newErrors.remarks = "Input contains illegal characters";
    }

    if (title.trim().length < 1) {
      newErrors.title = "Title is required";
    }
    if (title.trim().length > 0 && illegalChars.test(title.trim())) {
      newErrors.title = "Input contains illegal characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const handleEditTask = () => {
    const validated = validateFields();
    if (validated) {
      updateTask();
    } else {
      return;
    }
  };

  const updateTask = () => {
    const updatedTask = {
      title: title,
      dueDate: date.format("YYYY-MM-DD"),
      difficulty: selectedDifficulty,
      importance: selectedImportance,
      remarks: remarks,
    };
    dispatch(editTask({ id: taskSelected.id, updatedTask }));
    Toast.show({
      type: "success",
      text1: "Task Updated!",
      text2: "Press to dismiss",
      visibilityTime: 3000,
      autoHide: true,
      position: "bottom",
      onPress: () => Toast.hide(),
    });
    navigation.goBack();
  };

  const handleDone = () => {
    Keyboard.dismiss();
  };

  const chooseDate = (date) => {
    setDate(date);
    setdateModalVisible(!dateModalVisible);
  };

  const formatDate = (date) => {
    return date.format("YYYY-MM-DD");
  };

  return (
    <Provider>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.wrapper}>
          <SafeAreaView edges={["bottom"]} style={styles.safeArea} />

          <ScrollView>
            <View style={styles.container}>
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

              <View style={{ marginTop: 10, paddingBottom: 10 }}>
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.bigHeaderText}>edit task</Text>
                </View>
              </View>

              <View style={styles.topBox}>
                <Text style={styles.headerText}>Title</Text>
                <View style={styles.subBox}>
                  <TextInput
                    maxLength={120}
                    editable
                    multiline
                    style={styles.input}
                    onChangeText={onChangeTitle}
                    value={title}
                    returnKeyType="done"
                    onSubmitEditing={handleDone}
                    blurOnSubmit={true}
                    onChange={() => setErrors({ ...errors, title: null })}
                  />
                </View>
                {errors.title && (
                  <View style={{ position: "absolute", bottom: -15 }}>
                    <Text style={styles.errorText}>{errors.title}</Text>
                  </View>
                )}
              </View>

              <View style={styles.mainBox}>
                <Text style={styles.headerText}>Due Date*</Text>
                <View style={styles.datesBox}>
                  <TouchableOpacity
                    onPress={toggleDatepicker}
                    style={styles.dateDisplayBox}
                  >
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                    <Ionicons
                      style={{ marginRight: 18 }}
                      name="calendar-outline"
                      size={23}
                      color={darkMode ? colors.darkText : colors.lightText}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {dateModalVisible && (
                <View
                  style={{
                    backgroundColor: darkMode
                      ? colors.darkBackground
                      : colors.lightBackground,
                    paddingHorizontal: 5,
                    borderWidth: 2,
                    borderColor: darkMode
                      ? colors.darkAccent
                      : colors.lightAccent,
                    borderRadius: 10,
                    paddingTop: 5,
                  }}
                >
                  <DateTimePicker
                    mode="single"
                    date={date}
                    onChange={(params) => chooseDate(params.date)}
                    minDate={dayjs().subtract(1, "day")}
                    calendarTextStyle={{
                      color: darkMode ? colors.darkText : colors.lightText,
                    }}
                    headerTextStyle={{
                      color: darkMode ? colors.darkText : colors.lightText,
                    }}
                    weekDaysTextStyle={{
                      color: darkMode ? colors.darkText : colors.lightText,
                    }}
                    headerButtonColor={
                      darkMode ? colors.darkText : colors.lightText
                    }
                    todayContainerStyle={{
                      borderColor: darkMode
                        ? colors.darkAccent
                        : colors.lightAccent,
                      borderRadius: 5,
                    }}
                    todayTextStyle={{
                      color: darkMode ? colors.darkAccent : colors.lightAccent,
                    }}
                    selectedItemColor={
                      darkMode ? colors.darkAccent : colors.lightAccent
                    }
                    dayContainerStyle={{ borderRadius: 5 }}
                  />
                </View>
              )}

              <View style={styles.mainBox}>
                <Text style={styles.headerText}>Importance*</Text>
                <SelectList
                  setSelected={(key) => setSelectedImportance(key)}
                  data={importanceData}
                  save="key"
                  defaultOption={importanceData[selectedImportance - 1]}
                  search={false}
                  boxStyles={styles.optionBox}
                  inputStyles={styles.optionText}
                  dropdownStyles={styles.dropdownBox}
                  dropdownItemStyles={{ paddingVertical: 10 }}
                  dropdownTextStyles={styles.optionText}
                  arrowicon={
                    <Ionicons
                      name="chevron-down-circle-outline"
                      size={23}
                      color={darkMode ? colors.darkText : colors.lightText}
                    />
                  }
                />
              </View>

              <View style={styles.mainBox}>
                <Text style={styles.headerText}>Difficulty*</Text>
                <SelectList
                  setSelected={(key) => setSelectedDifficulty(key)}
                  data={difficultyData}
                  save="key"
                  defaultOption={difficultyData[selectedDifficulty - 1]}
                  search={false}
                  boxStyles={styles.optionBox}
                  inputStyles={styles.optionText}
                  dropdownStyles={styles.dropdownBox}
                  dropdownItemStyles={{ paddingVertical: 10 }}
                  dropdownTextStyles={styles.optionText}
                  arrowicon={
                    <Ionicons
                      name="chevron-down-circle-outline"
                      size={23}
                      color={darkMode ? colors.darkText : colors.lightText}
                    />
                  }
                />
              </View>

              <View style={styles.mainBox}>
                <Text style={styles.headerText}>Remarks</Text>
                <View style={styles.subBox}>
                  <TextInput
                    maxLength={120}
                    editable
                    multiline
                    style={styles.input}
                    onChangeText={onChangeRemarks}
                    value={remarks}
                    returnKeyType="done"
                    onSubmitEditing={handleDone}
                    blurOnSubmit={true}
                    placeholder={"optional"}
                    onChange={() => setErrors({ ...errors, remarks: null })}
                  />
                </View>
                {errors.remarks && (
                  <View style={{ position: "absolute", bottom: -15 }}>
                    <Text style={styles.errorText}>{errors.remarks}</Text>
                  </View>
                )}
              </View>

              <View style={{ marginTop: 25 }}>
                <TextIconButton
                  icon="arrow-up-circle"
                  buttonText="Update"
                  darkMode={darkMode}
                  onPress={handleEditTask}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
      flex: 1,
      alignSelf: "flex-start",
      marginTop: windowsWidth * 0.1,
    },

    bigHeaderText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.17,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 2,
    },

    headerText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    input: {
      width: "100%",
      fontFamily: "Roboto-Light",
      color: darkMode ? colors.darkText : colors.lightText,
      fontSize: windowsWidth * 0.16,
      padding: windowsWidth * 0.14,
    },

    topBox: {
      width: "100%",
      paddingBottom: windowsWidth * 0.08,
      paddingTop: windowsWidth * 0.15,
    },

    mainBox: {
      width: "100%",
      paddingBottom: windowsWidth * 0.08,
      paddingTop: windowsWidth * 0.25,
    },

    subBox: {
      backgroundColor: darkMode ? colors.darkTint : colors.lightTint,
      marginTop: windowsWidth * 0.1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      width: "100%",
    },

    optionBox: {
      backgroundColor: darkMode ? colors.darkTint : colors.lightTint,
      marginTop: windowsWidth * 0.1,
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 10,
      width: "100%",
      borderWidth: 0,
      paddingVertical: windowsWidth * 0.12,
    },

    datesBox: {
      width: "100%",
      flexDirection: "row",
      alignContent: "space-between",
      backgroundColor: darkMode ? colors.darkTint : colors.lightTint,
      marginTop: windowsWidth * 0.1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },

    dateText: {
      fontFamily: "Roboto-Light",
      color: darkMode ? colors.darkText : colors.lightText,
      fontSize: windowsWidth * 0.16,
      padding: windowsWidth * 0.14,
    },

    optionText: {
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "Roboto-Light",
      fontSize: windowsWidth * 0.16,
      paddingVertical: windowsWidth * 0.03,
    },

    dropdownBox: {
      marginTop: 0,
      backgroundColor: darkMode
        ? colors.darkBackground
        : colors.lightBackground,
      borderColor: darkMode ? colors.darkAccent : colors.lightAccent,
    },

    dateDisplayBox: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    errorText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.16,
      color: "crimson",
      fontFamily: "Roboto-Light",
    },
  });
  return styles;
};

export default EditTaskScreen;
