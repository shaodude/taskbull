import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Screens/Homepage";
import TaskListScreen from "./Screens/TaskList";
import SettingsScreen from "./Screens/Settings";
import GameScreen from "./Screens/Game";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./styles";
import { useSelector } from "react-redux";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const darkMode = useSelector((state) => state.user.darkMode);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "TaskList") {
            iconName = "list-sharp";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          } else if (route.name === "Game") {
            iconName = "ribbon-outline";
          }

          return <Ionicons name={iconName} size={35} color={color} />;
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: darkMode
          ? colors.darkAccent
          : colors.lightAccent,
        tabBarInactiveTintColor: darkMode ? colors.darkText : colors.lightText,
        tabBarStyle: {
          backgroundColor: darkMode ? colors.darkTint : colors.lightTint,
          padding: Platform.OS === "ios" ? 5 : 0,
          paddingBottom: Platform.OS === "android" ? 5 : 20,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Game" component={GameScreen} />
      <Tab.Screen name="TaskList" component={TaskListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
