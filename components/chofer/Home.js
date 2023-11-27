import React, { useState, useEffect } from "react";
import QRCode from "react-native-qrcode-svg";

let logoFromFile = require("../../assets/utils/logo.png");

import {
  StyleSheet,
  Modal,
  View,
  Pressable,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import { ListItem } from "react-native-elements";
import generateQRCode from "../utils/generateQRCode";
import deleteQr from "../utils/deleteQR";

import AsyncStorage from "@react-native-async-storage/async-storage";
import scoketUrl from "../../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);

export default function HomeChofer() {
  const [savedQRCode, setSavedQRCode] = useState("");
  const [usuario, setUsuario] = useState([]);
  const [json, setJson] = useState([]);
  const [estimado, setEstimado] = useState([]);
  const [castigo, setCastigo] = useState([]);
  const [hora, setHora] = useState([]);

  const [id, setId] = useState(0);

  useEffect(() => {
    const connectToWebSocket = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("my-key");
        var key = JSON.parse(jsonValue);

        setId(key.dataAll.id_usuario);
        socket.emit("client:getChofer", key.dataAll.id_usuario);
        socket.on("server:getChofer", (data) => {
          // console.log(data);
          setUsuario(data[0]);
          setCastigo(data[0].castigo);
        });

        return () => {
          // Limpia la conexión WebSocket si es necesario
          socket.close();
        };
      } catch (e) {
        console.log("error");
      }
    };

    connectToWebSocket();

    //datos de los card
    socket.emit("client:getEstimado", id);
    socket.on("server:getEstimado", (data) => {
      setEstimado(data[0]);
      // console.log('getEstimado'+data[0]);
    });

    socket.on("server:DesactivarChofer", async (data) => {
      try {
        const jsonValue = await AsyncStorage.getItem("my-key");
        var key = JSON.parse(jsonValue);

        if (data.id_usuario == key.dataAll.id_usuario) {
          deleteQr(key.dataAll.id_usuario, setSavedQRCode);
          setShowQR(false);
        }
      } catch (e) {
        console.log("error");
      }
    });
    //obtener horas laboradas
    socket.emit("client:getHoras", id);
    socket.on("server:getHoras", (data) => {
      setHora(data[0]);
      // console.log(data[0]);
    });
  }, []);
  var today = new Date();
  // obtener la fecha y la hora
  var now = today.toLocaleString();

  const generateQR = () => {
    if (usuario.id_unidad !== "0") {
      const updatedJson = {
        usuario: id,
        hora: now,
        modelo: usuario.modelo,
        placas: usuario.placas,
        economico: usuario.no_economico,
        nombre: usuario.nombre_completo,
        ruta: usuario.ruta,
        destino: usuario.destino,
        id_ruta: usuario.id_ruta,
        castigado: usuario.castigo,
      };
      setJson(updatedJson);
      generateQRCode(id, setSavedQRCode, updatedJson);
      setShowQR(true);
    } else {
      alert("Aun no tienes asignada una Unidad", "warning");
    }
  };

  const destroyQRCode = () => {
    deleteQr(id, setSavedQRCode);
    setShowQR(false);
  };
  // console.log('estimado'+estimado.estimado);
  // console.log('estimado'+estimado.estimado);

  const cardData = [
    // { title: "Tiempo:", value: "30 min" },
    {
      title: "En dirección a:",
      value: estimado ? estimado.destino : "SIN RUTA",
    },
    {
      title: "Llegada estimada:",
      value: estimado ? estimado.estimado : "SIN TIEMPO ESTIMADO",
    },
    {
      title: "Horas laboradas hoy:",
      value: hora ? hora.total_horas_hoy ?? "0" : "0",
    },
  ];

  const [showQR, setShowQR] = useState(false);

  // informacion del usuario
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const closeQRCode = () => {
    setShowQR(false);
  };
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.title + item.value}</Text>
    </View>
  );
  return (
    // <ScrollView>
      <View style={styles.container}>
        {showQR ? (
          <>
            <Pressable style={styles.button_red} onPress={destroyQRCode}>
              <Text style={styles.buttonText}>Desactivar</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.button} onPress={generateQR}>
            <Text style={styles.buttonText}>Activar</Text>
          </Pressable>
        )}

        <FlatList
          data={cardData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
        />

        <View style={{ marginTop: 10 }}>
          {/* {showQR && <QRCode value="http://awesome.link.qr" />} */}
        </View>
        <View style={styles.container2}>
          {castigo == 1 && <Text style={styles.castigoText}>CASTIGADO</Text>}

          {showQR && (
            <View style={styles.qrCode}>
              <QRCode
                size={200}
                logo={logoFromFile}
                logoSize={40}
                value={JSON.stringify(json)}
              />
            </View>
          )}

          {!savedQRCode && (
            <Text style={styles.generateQRText}>
              Activate para Generar tu codigo QR
            </Text>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
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
