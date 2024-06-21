import React, { useState, createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TasksContext = createContext(null);

export function TasksContextProvider({ children }) {
  const [tasks, setTasks] = useState([
    // { id: 0, title: "hi", date: "10/10/10", status: "pending" },
    // { id: 1, title: "hi", date: "10/10/10", status: "pending" },
  ]);
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Success", "All data cleared successfully.");
    } catch (error) {
      console.error("Failed to clear AsyncStorage:", error);
    }
  };
  useEffect(() => {
    clearAllData();
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem("Tasks");
        if (savedTasks !== null) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error("Error loading tasks from AsyncStorage:", error);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("Tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks to AsyncStorage:", error);
      }
    };

    saveTasks();
  }, [tasks]);

  function AddTask(newTask) {
    // console.log(tasks)
    setTasks([...tasks, newTask]);
  }

  function editTask(id, newTask) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...newTask } : task
    );
    setTasks(updatedTasks);
  }

  return (
    <TasksContext.Provider value={{ tasks, AddTask, editTask }}>
      {children}
    </TasksContext.Provider>
  );
}
