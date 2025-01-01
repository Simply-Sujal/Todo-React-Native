import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { data } from "@/data/todos"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import Octicons from "@expo/vector-icons/Octicons";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  // const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id));
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loaded, error] = useFonts({
    Inter_500Medium,
  })
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)


  // getting the persisted data 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodo = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodo && storageTodo.length) {
          setTodos(storageTodo.sort((a, b) => b.id - a.id));
        } else {
          setTodos(data.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [data])


  // for storing the data or you can say for persistent data , whenever new todo comes we will store it 
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch (error) {
        console.log(error);
      }
    }

    storeData();
  }, [todos])

  if (!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme, colorScheme);

  // add todos 
  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos])
      setText("");
    }
  }

  // update the todos 
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }


  // deleting the todos
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}

      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.todoName}>Sujal's TodoList</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={(value) => setText(value)}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>

        <Pressable onPress={() => setColorScheme(colorScheme === "light" ? "dark" : "light")} style={{ marginLeft: 10 }}>
          {
            colorScheme === "dark" ? <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
              :
              <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
          }
        </Pressable>
      </View>

      <Animated.FlatList
        data={todos}
        keyExtractor={todos => todos.id}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={renderItem}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}


function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      // width: "100%",
      backgroundColor: theme.background,
      paddingTop: 10
    },
    todoName: {
      textAlign: "center",
      color: colorScheme === "dark" ? "#fff" : "#000",
      fontSize: 25,
      fontWeight: "bold",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      padding: 10,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      minWidth: 0,
      color: theme.text,
      fontFamily: "Inter_500Medium"
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
      padding: 10,
      borderBottomColor: "gray",
      borderBottomWidth: 1,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto"
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      color: theme.text,
      fontFamily: "Inter_500Medium"
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray"
    }
  })
}