import { Text } from "react-native-paper";
import { StyleSheet, TouchableOpacity, Dimensions, View } from "react-native";
import { colors } from "../styles";
import { Ionicons } from "@expo/vector-icons";

const TextIconButton = ({
  icon,
  buttonText,
  darkMode,
  onPress,
  whiteBack = true,
}) => {
  const styles = createStyles(darkMode);
  return (
    <TouchableOpacity style={styles.buttonBox} onPress={onPress}>
      <Text style={styles.innerText}>{buttonText}</Text>
      <View>
        {whiteBack && (
          <Ionicons
            style={{ position: "absolute" }}
            name="ellipse"
            size={32}
            color={colors.darkText}
          />
        )}
        <Ionicons
          name={icon}
          size={32}
          color={darkMode ? colors.darkAccent : colors.lightAccent}
        />
      </View>
    </TouchableOpacity>
  );
};

const windowsWidth = Dimensions.get("window").width / 4;

const createStyles = (darkMode) => {
  const styles = StyleSheet.create({
    buttonBox: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderColor: darkMode ? colors.darkAccent : colors.lightAccent,
    },

    innerText: {
      fontFamily: "Roboto-Light",
      color: darkMode ? colors.darkText : colors.lightText,
      fontSize: windowsWidth * 0.15,
      textAlign: "center",
      paddingRight: 10,
    },
  });
  return styles;
};

export default TextIconButton;
