import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Modal,
  View,
  Pressable,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import AdminActivosPieChart from "./AdminActivosPieChart";
import AdminChartCastigados from "./AdminChartCastigados";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiUrl from "../../api/api";
import scoketUrl from "../../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);

export default function HomeAdmin() {
  const [card, setCard] = useState([]);
  const urlCad = apiUrl + "admin/adminTablero/";
  useEffect(() => {
    request();
  }, []);
  const request = async () => {
    const respuesta = await axios.get(urlCad);
    setCard(respuesta.data[0][0]);
    console.log(respuesta.data[0][0]);
  };

  const cardData = [
    {
      title: "TOTAL DE CHOFERES:",
      value: card && card.chofer ? card.chofer : "",
    },
    {
      title: "TOTAL DE CHECADORES:",
      value: card && card.checador ? card.checador : "",
    },
    {
      title: "TOTAL DE DUEÑOS :",
      value: card && card.duenio ? card.duenio : "",
    },
    {
      title: "TOTAL DE UNIDADES:",
      value: card && card.unidades ? card.unidades : "",
    },
  ];
  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          {cardData.map((data, index) => (
            <Card key={index} style={{ margin: 10 }}>
              <Card.Content>
                <Title>{data.title}</Title>
                <Paragraph>{data.value}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>

        <View style={styles.containerPie}>
          <AdminActivosPieChart />
        </View>
        {/* <View style={styles.container}> */}
          {/* <AdminChartCastigados /> */}
        {/* </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
  container: {
    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
  },

  containerPie: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    //
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  button_red: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modalContent: {
    height: "25%",
    width: "100%",
    backgroundColor: "#25292e",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingVertical: 20,
  },

  container2: {
    padding: 5,
    borderWidth: 1,
    backgroundColor: "lightskyblue",
  },
  castigoText: {
    fontSize: 24,
  },

  qrCode: {
    backgroundColor: "white",
    borderWidth: 4,
    borderRadius: 10,
    // shadowColor: "blue",
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    // boxShadow: "0px 2px 0.2 rgba(0, 0, 0, 0.2)",
    padding: 12,
    width: 230,
    height: 230,
  },

  generateQRText: {
    fontSize: 16,
  },

  item: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
  },
});
