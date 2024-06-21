import React, { useState, useContext, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TasksContextProvider, TasksContext } from "./useTasks.js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateFiald = ({ date, setDate }) => {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <SafeAreaView>
      <View style={{ ...DatePicker.container, marginVertical: 15 }}>
        <TouchableOpacity style={DatePicker.button} onPress={showDatepicker}>
          <Text style={DatePicker.buttonText}>Select a Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={DatePicker.button} onPress={showTimepicker}>
          <Text style={DatePicker.buttonText}>Select a Time</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ textAlign: "center", marginBottom: 10 }}>
        selected: {date.toLocaleString()}
      </Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();
function Task({ navigation, task }) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Edit", {
          item: task,
        });
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 5,
          padding: 0,
        }}
      >
        <View style={{ width: "50%", padding: 10 }}>
          <Text style={{ padding: 2, fontSize: 20 }}>{task.title}</Text>
          <Text style={{ padding: 2, fontSize: 10, color: "grey" }}>
            {Date(task.date).toLocaleString()}
          </Text>
        </View>
        <View
          style={{
            width: 100,
            padding: 10,
            backgroundColor: task.status == "pending" ? "#f29339" : "green",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: task.status == "pending" ? "#f29339" : "green",
          }}
        >
          {task.status == "pending" ? (
            <>
              <View style={{ width: "100%", flex: 2, alignItems: "center" }}>
                <MaterialIcons
                  style={{}}
                  name="pending-actions"
                  size={30}
                  color="white"
                />
              </View>
              <Text style={{ color: "#ffff", textAlign: "center" }}>
                pending
              </Text>
            </>
          ) : (
            <>
              <View style={{ width: "100%", flex: 2, alignItems: "center" }}>
                <MaterialIcons
                  style={{}}
                  name="done-all"
                  size={30}
                  color="white"
                />
              </View>
              <Text style={{ color: "#ffff", textAlign: "center" }}>
                Completed
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function AddTaskScreen({ navigation }) {
  const { tasks, AddTask } = useContext(TasksContext);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState("");

  useEffect(() => {
    console.log(date.toISOString());
  }, [date]);

  function Save(date, title, status) {
    if (date.toISOString() >= new Date().toISOString() && title && status) {
      console.log("hi");
      AddTask({
        id: tasks.length,
        date: date.toISOString(),
        title: title,
        status: status,
      });
      setDate(new Date());
      setStatus("");
      setTitle("");
      return navigation.navigate("Main");
    } else {
      Alert.alert("Wrong Value Added");
    }
  }
  return (
    <View style={styles.container}>
      <Text style={{ margin: 15 }}>Set Task Title </Text>
      <TextInput
        style={{ ...styles.input, marginBottom: 15 }}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <DateFiald date={date} setDate={setDate} />

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          height: "25%",
          marginTop: 15,
        }}
      >
        <Text style={{ height: 50 }}>
          Pending
          <RadioButton
            style={{}}
            value="pending"
            status={status === "pending" ? "checked" : "unchecked"}
            onPress={() => setStatus("pending")}
          />
        </Text>

        <Text style={{ height: 50 }}>
          Completed
          <RadioButton
            value="completed"
            status={status === "completed" ? "checked" : "unchecked"}
            onPress={() => setStatus("completed")}
          />
        </Text>

        <TouchableOpacity
          style={{ ...styles.button, marginTop: 20 }}
          onPress={() => Save(date, title, status)}
        >
          <Text style={styles.buttonText}> Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const { tasks } = useContext(TasksContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "start" }}>
      <Text style={{ padding: 10, fontSize: 30, fontWeight: 700 }}>Tasks </Text>
      <FlatList
        style={{ width: "100%" }}
        data={tasks}
        renderItem={({ item }) => {
          return <Task navigation={navigation} task={item}></Task>;
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
function EditTaskScreen({ route, navigation }) {
  const { editTask } = useContext(TasksContext);
  const { item } = route.params;
  const [title, setTitle] = useState(item.title);
  const [date, setDate] = useState(new Date(item.date));
  const [status, setStatus] = useState(item.status);

  return (
    <>
      <View style={styles.container}>
        <Text style={{ margin: 15 }}>Set Task Title </Text>
        <TextInput
          style={{ ...styles.input, marginBottom: 15 }}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <DateFiald date={date} setDate={setDate} />

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            height: "25%",
            marginTop: 15,
          }}
        >
          <Text style={{ height: 50 }}>
            Pending
            <RadioButton
              style={{}}
              value="pending"
              status={status === "pending" ? "checked" : "unchecked"}
              onPress={() => setStatus("pending")}
            />
          </Text>

          <Text style={{ height: 50 }}>
            Completed
            <RadioButton
              value="completed"
              status={status === "completed" ? "checked" : "unchecked"}
              onPress={() => setStatus("completed")}
            />
          </Text>

          <TouchableOpacity
            title="Edit Task"
            style={{ ...styles.button, marginTop: 20 }}
            onPress={() => {
              editTask(item.id, {
                title: title,
                date: date,
                status: status,
              });
              return navigation.navigate("Home");
            }}
          >
            <Text style={styles.buttonText}> Edit Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
function Main({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name="Edit" component={EditTaskScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TasksContextProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Main") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "AddTask") {
                iconName = focused ? "add-circle" : "add-circle-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            options={{ headerShown: false }}
            name="Main"
            component={Main}
          ></Tab.Screen>
          <Tab.Screen name="AddTask" component={AddTaskScreen}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </TasksContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the entire screen
    alignItems: "center", // Center children horizontally
    backgroundColor: "#fff", // Background color
    padding: 20, // Padding around the content
  },
  containera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputZ: {
    width: "100%",
    height: 40,
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "tomato",
    color: "gray",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
});

const DatePicker = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "45%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
