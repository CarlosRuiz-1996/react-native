import React, { useState, useEffect } from "react";
import QRCode from "react-native-qrcode-svg";
import {
  StyleSheet,
  FlatList,
  Modal,
  View,
  Pressable,
  Text,
  ScrollView,
  Button,
} from "react-native";
import { Card, ListItem } from "react-native-elements";
import generateQRCode from "../utils/generateQRCode";
import deleteQr from "../utils/deleteQR";
const data = [
  { id: 1, title: "Carlos Ruiz", description: "Crafter 2023, JHVB-45-K" },
  // { id: 2, title: "Elemento 2", description: "Descripción del elemento 2" },
  // Agrega más elementos aquí
];
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
          console.log(data);
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

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const closeQRCode = () => {
    setShowQR(false);
  };

  return (
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
      <ScrollView>
        {cardData.map((data, index) => (
          <ListItem key={index} bottomDivider>
            {/* <Avatar
            source={{ uri: data.avatarUrl }} // URL de la imagen de perfil del usuario
            size="medium"
          /> */}
            <ListItem.Content>
              <ListItem.Title>{data.title}</ListItem.Title>
              <ListItem.Subtitle>{data.value}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
      <View style={{ marginTop: 10 }}>
        {/* {showQR && <QRCode value="http://awesome.link.qr" />} */}
      </View>
      <View style={styles.container2}>
        {castigo == 1 && <Text style={styles.castigoText}>CASTIGADO</Text>}

        {showQR && (
          <View style={styles.qrCodeContainer}>
            <View style={styles.qrCode}>
              <View style={styles.qrCodeContent}>
                <View style={styles.qrCodeWrapper}>
                  <View style={styles.qrCodeInner}>
                    <Text style={styles.qrCodeText}>
                      <QRCode value={JSON.stringify(json)} />
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {!savedQRCode && (
          <Text style={styles.generateQRText}>
            Activate para Generar tu codigo QR
          </Text>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <View>
              {selectedItem && (
                <View>
                  <Text>{selectedItem.title}</Text>
                  <Text>{selectedItem.description}</Text>
                  <Pressable onPress={closeModal}>
                    <Text>Cerrar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: {
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
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
    backgroundColor: "lightgray",
  },
  castigoText: {
    fontSize: 24,
  },
  qrCodeContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  qrCode: {
    backgroundColor: "white",
    padding: 5,
    borderWidth: 4,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    padding: 12,
  },
  qrCodeContent: {
    flexDirection: "row",
  },
  qrCodeWrapper: {
    flex: 1,
    // marginRight: 12,
  },
  qrCodeInner: {
    flexDirection: "column",
    alignItems: "center",
  },
  qrCodeText: {
    fontSize: 20,
  },
  generateQRText: {
    fontSize: 16,
  },
});

// socket.emit("client:getChofer", id);
// socket.on("server:getChofer", (data) => {
//   console.log(data[0]);
//   setUsuario(data[0]);
//   setCastigo(data[0].castigo);
// });
// socket.on("server:updateDatos", async (data) => {
//   if (data == id) {
//     const result = await axios.get(apiUrl + "chofer/chofer/" + id);
//     deleteQr(id, setSavedQRCode, 1);
//     setJson({
//       usuario: id,
//       hora: now,
//       modelo: result.data[0].modelo,
//       placas: result.data[0].placas,
//       economico: result.data[0].no_economico,
//       nombre: result.data[0].nombre_completo,
//       ruta: result.data[0].ruta,
//       destino: result.data[0].destino,
//       id_ruta: result.data[0].id_ruta,
//       castigado: result.data[0].castigo,
//     });
//     setCastigo(result.data[0].castigo);
//     generateQRCode(id, setSavedQRCode, json, 1);
//   }
// });
// //datos de los card
// socket.emit("client:getEstimado", id);
// socket.on("server:getEstimado", (data) => {
//   setEstimado(data[0]);
// });
// socket.on("server:updateRuta", () => {
//   socket.emit("client:getEstimado", id);
// });
// socket.on("server:updatepdateCastigosAdmin", () => {
//   rehacerQr();
// });
// socket.on("server:updateIncidencia", () => {
//   rehacerQr();
// });
// //escucho a los sockets.
// // console.log(usuario)

// socket.on("server:DesactivarChofer", async (data) => {
//   if (data.id_usuario == id) {
//     if (data.opcion == 1) {
//       deleteQr(data.id_usuario, setSavedQRCode);
//     } else {
//       const result = await axios.get(apiUrl + "chofer/chofer/" + id);
//       // deleteQr(1, setSavedQRCode, 1);
//       setJson({
//         usuario: id,
//         hora: now,
//         modelo: result.data[0].modelo,
//         placas: result.data[0].placas,
//         economico: result.data[0].no_economico,
//         nombre: result.data[0].nombre_completo,
//         ruta: result.data[0].ruta,
//         destino: result.data[0].destino,
//         id_ruta: result.data[0].id_ruta,
//         castigado: result.data[0].castigo,
//       });
//       setCastigo(result.data[0].castigo);
//       generateQRCode(id, setSavedQRCode, json);
//     }
//   }
// });
// //obtener horas laboradas
// socket.emit("client:getHoras", id);
// socket.on("server:getHoras", (data) => {
//   setHora(data[0]);
//   // console.log(data[0]);
// });
// // Limpia el evento del socket al desmontar el componente
// return () => {
//   socket.off("server:getChofer");
//   socket.off("server:updateDatos");
// };
