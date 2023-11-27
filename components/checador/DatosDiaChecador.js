import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import socketIOClient from "socket.io-client";
import scoketUrl from "../../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);

const DatosDiaChecador = ({ punto }) => {

  // console.log(punto);
  const [activos, setActivos] = useState(0);

  useEffect(() => {
    socket.emit("client:countActivos");
    socket.on("server:countActivos", (data) => {
      setActivos(data[0].activos);
    });
    socket.on("server:ACTIVADO", () => {
      socket.emit("client:countActivos");
    });
    socket.on("server:DESACTIVADO", () => {
      socket.emit("client:countActivos");
    });
    return () => {
      socket.off("server:countActivos");
      socket.off("server:ACTIVADO");
      socket.off("server:DESACTIVADO");
    };
  }, []);

  return (
    // <ScrollView>
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <Card.Title>MI PUNTO DE CHEQUEO</Card.Title>
          <Card.Divider />
          <Text>{punto}</Text>
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitleText}>NUMERO DE UNIDADES ACTIVAS</Text>
              {/* <TouchableOpacity onPress={() => navigation.navigate("activas")}>
                <Text style={styles.verTodasText}>VER TODAS</Text>
              </TouchableOpacity> */}
            </View>
          </Card.Title>
          <Card.Divider />
          <Text>{activos} unidades</Text>
        </Card>

        <Card containerStyle={styles.card}>
          <Card.Title>FRECUENCIA DE SALIDA RECOMENDADA</Card.Title>
          <Card.Divider />
          <Text>10 min</Text>
        </Card>
      </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    // marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitleText: {
    fontSize: 16,
  },
 
});

export default DatosDiaChecador;
