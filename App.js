import { useEffect, useRef } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import AppNavigator from "./AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "./styles";
import { StatusBar, View, Text } from "react-native";
import store from "./redux/store";
import {
  fetchUserData,
  updateUserData,
  setLastSynced,
} from "./redux/userSlice";
import { ActivityIndicator } from "react-native-paper";
import dayjs from "dayjs";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const MainApp = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.user.darkMode);
  const [loaded, error] = useFonts({
    "LibreB-Italic": require("./assets/fonts/LibreBaskerville-Italic.ttf"),
    "LibreB-Bold": require("./assets/fonts/LibreBaskerville-Bold.ttf"),
    "LibreB-Regular": require("./assets/fonts/LibreBaskerville-Regular.ttf"),
    "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  const userDataStatus = useSelector((state) => state.user.status);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const intervalRef = useRef(null);

  useEffect(() => {
    const syncWithCloud = () => {
      dispatch(updateUserData());
      // Get today's date and time
      const now = dayjs();
      // Format the date and time as a string
      const formattedDate = now.format("YYYY-MM-DD HH:mm:ss");
      dispatch(setLastSynced(formattedDate));
      console.log("synced!");
    };

    // Set up the interval to sync with the cloud every 1 minute
    intervalRef.current = setInterval(syncWithCloud, 1 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if ((loaded || error) && userDataStatus === "initialized") {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, userDataStatus]);

  if (!loaded && !error) {
    return null;
  }
  if (userDataStatus === "loading") {
    return (
      <View>
        <ActivityIndicator animating={true} color={colors.darkAccent} />
      </View>
    );
  }
  if (userDataStatus === "failed") {
    return (
      <View>
        <Text>Something went wrong, please try again later!</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={darkMode ? colors.darkText : colors.lightText} />
      <NavigationContainer>
        <AppNavigator />
        <Toast />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
