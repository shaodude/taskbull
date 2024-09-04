import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import emailjs, { EmailJSResponseStatus } from "@emailjs/react-native";
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
  Dimensions,
} from "react-native";
import { colors } from "../styles";
import TextIconButton from "../components/TextIconButton";

// Force Portrait mode
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

const ReportIssueScreen = () => {
  const navigation = useNavigation();
  const darkMode = useSelector((state) => state.user.darkMode);
  const styles = createStyles(darkMode);
  const userId = useSelector((state) => state.user.userId);
  const [message, onChangeMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  // configure template params according to template set in EmailJS
  const templateParams = {
    user_id: userId,
    message: message,
  };

  const handleReport = async () => {
    try {
      setShowSpinner(true);
      await emailjs.send(
        "service_xnh7dxo",
        "template_t52fqut",
        templateParams,
        {
          publicKey: "OmXbZpvdGK8oyrn8Q",
        }
      );
      setShowSpinner(false);
      navigation.navigate("Settings");
      Toast.show({
        type: "success",
        text1: "Report Submitted, Thank You!",
        text2: "Press to dismiss",
        visibilityTime: 3000,
        autoHide: true,
        position: "bottom",
        onPress: () => Toast.hide(),
      });
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log("EMAILJS FAILED...", err);
        return;
      }

      console.log("ERROR", err);
      Toast.show({
        type: "error",
        text1: "Unable to submit right now, Please try again later!",
        text2: "Press to dismiss",
        visibilityTime: 3000,
        autoHide: true,
        position: "bottom",
        onPress: () => Toast.hide(),
      });
    }
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
                  <Text style={styles.bigHeaderText}>report an issue</Text>
                </View>
              </View>
              <View style={styles.subBox}>
                <TextInput
                  maxLength={300}
                  editable
                  multiline
                  style={styles.input}
                  onChangeText={onChangeMessage}
                  value={message}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>

              <View style={{ marginTop: 25 }}>
                <TextIconButton
                  icon="arrow-forward-circle"
                  buttonText="Submit"
                  darkMode={darkMode}
                  onPress={handleReport}
                />
              </View>

              <ActivityIndicator
                style={{ marginTop: 15 }}
                animating={showSpinner}
                color={colors.darkAccent}
                size={"large"}
              />
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

    errorText: {
      textAlign: "left",
      fontSize: windowsWidth * 0.16,
      color: "crimson",
      fontFamily: "Roboto-Light",
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
      width: "80%",
      minHeight: windowsWidth * 0.9,
    },

    optionBox: {
      backgroundColor: darkMode ? colors.darkTint : colors.lightTint,
      marginTop: windowsWidth * 0.1,
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 10,
      width: "100%",
      borderWidth: 0,
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
  });
  return styles;
};

export default ReportIssueScreen;
