import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Alert,StyleSheet } from "react-native";
import { Badge, Snackbar } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiUrl from "../api/api";
import scoketUrl from "../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);

const Notificaciones = ({ navigation }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
//   const navigation = useNavigation();
  const [user,setUser]=useState();
  const [rol, setRol] = useState(0);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("my-key");
      var key = JSON.parse(jsonValue);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      setUser(key.dataAll.id_usuario);
      setRol(key.dataAll.rol);
      socket.emit("client:getNotificacion", key.dataAll.id_usuario);
    } catch (e) {
      console.log("error");
    }
  };
  useEffect(() => {
    socket.on("server:getNotificacion", (data) => {
        // Actualizar la lista de notificaciones recibidas
        console.log('data:');
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

  

  const handleQuitarNotificacion = async (id) => {
    await axios({
      method: "DELETE",
      url: apiUrl+"admin/notificacion",
      data: { id_notificacion: id },
    }).then(function (response) {
      if (rol == 1) {
        // navigation.navigate("IncidenciasAdmin");
        
      } else {
        navigation.navigate("Incidencias");
      }
    });
  };

  return (
    <View style={styles.container}>
    


      {/* Lista de notificaciones */}
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id_notificacion}
          onPress={() => handleQuitarNotificacion(notification.id_notificacion)}
        >
          <View style={styles.item}>
            <Text style={styles.itemText}>{notification.nombre_completo}</Text>
            {notification.tipo === "incidencia" &&
              notification.rol_destino === 1 && (
                <Text>Ha generado una incidencia</Text>
              )}
            {notification.tipo === "incidencia" &&
              notification.rol_destino !== 1 && (
                <Text>Ha resuelto tu incidencia</Text>
              )}
          </View>
        </TouchableOpacity>
      ))}

      {/* Mensaje de no hay notificaciones */}
      {notifications.length === 0 && (
        <View style={styles.item}>
          <Text>SIN notificaciones</Text>
        </View>
      )}
    </View>
  );
};

export default Notificaciones;



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f1f1f1",
      //
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
  
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
  
    input: {
      flex: 1,
      height: 40,
      borderColor: "gray",
      backgroundColor: "white",
      borderWidth: 1,
      marginBottom: 8,
      paddingLeft: 8,
      marginLeft: 20,
      marginRight: 20,
      borderRadius: 5,
    },
    item: {
      backgroundColor: "#fff",
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
      alignSelf: "flex-start",
    },
    itemText: {
      fontSize: 16,
    },
    pagination: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    button: {
      backgroundColor: "#007BFF",
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
    },
  });