import { StyleSheet, View, Text, Button } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeChofer from "../components/chofer/Home";
import Incidecias from "../components/chofer/Incidencias";
import CrearIncidencia from "../components/chofer/CrearIncidencia";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Castigos from "../components/chofer/Castigos";
import HomeChecador from "../components/checador/Home";
import Settings from "../components/Settings";
import Notificaciones from "./Notificaciones";
import HomeAdmin from "./admin/Home";
import IncidenciasAdmin from "./admin/Incidencias";
import ValidarIncidencia from "./admin/ValidarIncidencia";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodasUnidades from "./checador/TodasUnidades";
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const HomeIncidenciasStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarIncidencia"
        component={Incidecias}
        options={{
          title: "Mis incidencias",
          // headerStyle: {
          //   backgroundColor: '#f4511e',
          // },
          // headerTintColor: '#fff',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CrearIncidencia"
        component={CrearIncidencia}
        options={{
          title: "Crear Incidencia",
          // headerStyle: {
          //   backgroundColor: '#f4511e',
          // },
          // headerTintColor: '#fff',
          // headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};
const HomeIncidenciasStackAdmin = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarIncidenciaAdmin"
        component={IncidenciasAdmin}
        options={{
          title: "Lista incidencias",
          // headerStyle: {
          //   backgroundColor: '#f4511e',
          // },
          // headerTintColor: '#fff',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ValidarIncidencia"
        component={ValidarIncidencia}
        options={{
          title: "Validar Incidencia",
          // headerStyle: {
          //   backgroundColor: '#f4511e',
          // },
          // headerTintColor: '#fff',
          // headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};
import scoketUrl from "../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);
function Chofer() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState();
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("my-key");
      var key = JSON.parse(jsonValue);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      setUser(key.dataAll.id_usuario);
      socket.emit("client:getNotificacion", key.dataAll.id_usuario);
    } catch (e) {
      console.log("error");
    }
  };
  useEffect(() => {
    socket.on("server:getNotificacion", (data) => {
      // Actualizar la lista de notificaciones recibidas
      console.log("data:");
      console.log(data);
      setNotifications(data);
      setNotificationCount(data.length);
    });
    // Escuchar el evento de notificación recibida desde el servidor
    getData();
    socket.on("server:updateNotificacion", () => {
      socket.emit("client:getNotificacion", user);
    });
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="InicioChofer"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: "#694fad" }}
    >
      <Tab.Screen
        name="Bienvenido chofer"
        component={HomeChofer}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Incidencias"
        component={HomeIncidenciasStack}
        options={{
          tabBarLabel: "Incidencias",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="file-document-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Catigos"
        component={Castigos}
        options={{
          tabBarLabel: "Catigos",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="file-cancel"
              color={color}
              size={26}
            />
          ),
        }}
      />

      {/* alarm-light */}
      <Tab.Screen
        name="Notificaciones"
        component={Notificaciones}
        options={{
          tabBarLabel: "Notificaciones",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="alarm-light"
              color={notificationCount!=0?'red':color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Cuenta"
        component={Settings}
        options={{
          tabBarLabel: "Cuenta",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-settings"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function Checador() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Bienvenido checador"
        component={HomeChecador}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Todas las unidades"
        component={TodasUnidades}
        options={{
          tabBarLabel: "unidades",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="car" color={color} size={26} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Cuenta"
        component={Settings}
        options={{
          tabBarLabel: "Cuenta",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-settings"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Admin() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Bienvenido Administrador"
        component={HomeAdmin}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
     <Tab.Screen
        name="IncidenciasAdmin"
        component={HomeIncidenciasStackAdmin}
        options={{
          tabBarLabel: "Incidencas",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="file-document-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Cuenta"
        component={Settings}
        options={{
          tabBarLabel: "Cuenta",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-settings"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function UserWeb() {
  return (
    <Tab.Navigator
      initialRouteName="Cuenta"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: "#694fad" }}
    >
      <Tab.Screen
        name="Cuenta"
        component={Settings}
        options={{
          tabBarLabel: "Cuenta",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-settings"
              color={color}
              size={26}
            />
          ),
        }}
      />
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
  // console.log('rol'+rol)
  return (
    <View style={styles.container}>
      {rol === 3 ? (
        <Chofer />
      ) : rol === 2 ? (
        <Checador />
      ) : rol === 1 ? (
        <Admin />
        ) : (

        <View
          style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
        >
          <Text>Bienvenido.</Text>
          <Text>Solo puedes entrar desde el navegador.</Text>
          <UserWeb />
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
