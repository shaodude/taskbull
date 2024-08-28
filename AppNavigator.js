import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";
import CreateTaskScreen from "./Screens/CreateTask";
import TaskDetailsScreen from "./Screens/TaskDetails";
import EditTaskScreen from "./Screens/EditTask";
import ReportIssueScreen from "./Screens/ReportIssue";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Overview"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Overview" component={BottomTabNavigator} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} />
      <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
