import { StyleSheet, View, Text, Button } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeChofer from "../components/chofer/Home";
import HomeChecador from "../components/checador/Home";
import Settings from "../components/Settings";


const Tab = createBottomTabNavigator();



function Chofer() {
  return (
    <Tab.Navigator  initialRouteName="Home"
    activeColor="#f0edf6"
    inactiveColor="#3e2465"
    barStyle={{ backgroundColor: '#694fad' }}>
      <Tab.Screen name="Inicio" component={HomeChofer} />
      <Tab.Screen name="Settings"  component={Settings} />
    </Tab.Navigator>
  );
}
function Checador() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Inicio" component={HomeChecador} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default function Inicio() {
  const [rol, setRol] = useState(0);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("my-key");
      var key = JSON.parse(jsonValue);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      setRol(key.dataAll.rol);
    } catch (e) {
      console.log("error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {rol === 3 ? (
        <Chofer />
      ) : rol === 2 ? (
        <Checador />
      ) : (
        <View style={{flex: 1, alignContent:"center", justifyContent: "center"      }}>
          <Text>Bienvenido.</Text>
          <Text>Solo puedes entrar desde el navegador.</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
  },
});
