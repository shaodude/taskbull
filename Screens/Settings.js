import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, Switch } from "react-native-paper";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";
import emailjs, { EmailJSResponseStatus } from "@emailjs/react-native";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { colors } from "../styles";
import TextIconButton from "../components/TextIconButton";
import {
  setDarkMode,
  setUserName,
  updateUserData,
  setLastSynced,
} from "../redux/userSlice";

// Force Portrait mode
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const darkMode = useSelector((state) => state.user.darkMode);
  const userName = useSelector((state) => state.user.userName);
  const styles = createStyles(darkMode);
  const [isDarkSwitchOn, setIsDarkSwitchOn] = useState(darkMode);
  const [username, onChangeUsername] = useState(userName);
  const lastSynced = useSelector((state) => state.user.lastSynced);
  const lastSyncedFormatted = dayjs(lastSynced).format("MMMM D, YYYY h:mm A");
  const onToggleSwitch = () => setIsDarkSwitchOn(!isDarkSwitchOn);

  const handleDone = () => {
    Keyboard.dismiss();
  };

  const handleSaveChanges = () => {
    dispatch(setDarkMode(isDarkSwitchOn));
    dispatch(setUserName(username));

    Toast.show({
      type: "success",
      text1: "Changes Saved!",
      text2: "Press to dismiss",
      visibilityTime: 3000,
      autoHide: true,
      position: "bottom",
      onPress: () => Toast.hide(),
    });
  };

  const handleSync = () => {
    dispatch(updateUserData());
    // Get today's date and time
    const now = dayjs();
    // Format the date and time as a string
    const formattedDate = now.format("YYYY-MM-DD HH:mm:ss");
    dispatch(setLastSynced(formattedDate));

    Toast.show({
      type: "success",
      text1: "Synced wth cloud!",
      text2: "Press to dismiss",
      visibilityTime: 3000,
      autoHide: true,
      position: "bottom",
      onPress: () => Toast.hide(),
    });
  };

  const templateParams = {
    user_id: "123123",
    message: "Check this out!",
  };

  const handleReport = async () => {
    // try {
    //   await emailjs.send(
    //     "service_xnh7dxo",
    //     "template_t52fqut",
    //     templateParams,
    //     {
    //       publicKey: "OmXbZpvdGK8oyrn8Q",
    //     }
    //   );
    //   console.log("SUCCESS!");
    // } catch (err) {
    //   if (err instanceof EmailJSResponseStatus) {
    //     console.log("EMAILJS FAILED...", err);
    //     return;
    //   }

    //   console.log("ERROR", err);
    // }
    navigation.navigate("ReportIssue");

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
              <View style={styles.settingBox}>
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.bigHeaderText}>Settings</Text>
                </View>
              </View>

              <View style={styles.topBox}>
                <Text style={styles.headerText}>display name</Text>
                <View style={styles.subBox}>
                  <TextInput
                    maxLength={10}
                    editable
                    style={styles.input}
                    onChangeText={onChangeUsername}
                    value={username}
                    returnKeyType="done"
                    onSubmitEditing={handleDone}
                    blurOnSubmit={true}
                  />
                </View>
              </View>

              <View style={styles.customBox}>
                <Text style={styles.headerText}>language</Text>
                <View style={styles.subBox}>
                  <TextInput
                    editable={false}
                    style={styles.greyInput}
                    value="English"
                  />
                </View>
              </View>

              <View style={styles.mainBox}>
                <Text style={styles.headerText}>dark mode</Text>
                <Switch
                  color={darkMode ? colors.darkAccent : colors.lightAccent}
                  value={isDarkSwitchOn}
                  onValueChange={onToggleSwitch}
                  style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                />
              </View>

              <View style={{ marginTop: 40, width: "50%" }}>
                <TextIconButton
                  icon="alert-circle-outline"
                  buttonText="Report an issue"
                  darkMode={darkMode}
                  onPress={handleReport}
                  whiteBack={false}
                  muted={true}
                />
              </View>

              <View style={styles.syncBox}>
                <View style={{ width: "50%" }}>
                  <TextIconButton
                    icon="cloud-upload-outline"
                    buttonText="Sync with cloud"
                    darkMode={darkMode}
                    onPress={handleSync}
                    whiteBack={false}
                  />
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={styles.syncText}>
                    Last synced on {lastSyncedFormatted}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.stickyButton}>
          <TextIconButton
            icon="checkmark-circle"
            buttonText="Save Changes"
            darkMode={darkMode}
            onPress={handleSaveChanges}
          />
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

    headerText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 2,
    },

    syncText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.14,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "Roboto-Light",
    },

    bigHeaderText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.17,
      color: darkMode ? colors.darkText : colors.lightText,
      fontFamily: "LibreB-Regular",
      textTransform: "uppercase",
      letterSpacing: 2,
    },

    topBox: {
      width: "100%",
      paddingBottom: windowsWidth * 0.08,
      marginTop: windowsWidth * 0.45,
    },

    customBox: {
      width: "100%",
      paddingBottom: windowsWidth * 0.08,
      marginTop: windowsWidth * 0.25,
    },

    syncBox: {
      width: "100%",
      paddingBottom: windowsWidth * 0.08,
      marginTop: windowsWidth * 0.4,
      justifyContent: "center",
      alignItems: "center",
    },

    subBox: {
      backgroundColor: darkMode ? colors.darkTint : colors.lightTint,
      marginTop: windowsWidth * 0.1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      width: "100%",
    },

    input: {
      width: "100%",
      fontFamily: "Roboto-Light",
      color: darkMode ? colors.darkText : colors.lightText,
      fontSize: windowsWidth * 0.17,
      padding: windowsWidth * 0.14,
    },

    greyInput: {
      width: "100%",
      fontFamily: "Roboto-Light",
      color: "#999999",
      fontSize: windowsWidth * 0.17,
      padding: windowsWidth * 0.14,
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

    mainBox: {
      width: "60%",
      paddingBottom: windowsWidth * 0.08,
      paddingTop: windowsWidth * 0.25,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "flex-start",
    },

    settingBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 10,
    },
  });
  return styles;
};

export default SettingsScreen;
