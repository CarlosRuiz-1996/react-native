import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCodeScanner from "./QRCodeScanner";
import DatosDiaChecador from "./DatosDiaChecador";
import axios from "axios";
import apiUrl from "../../api/api";
import scoketUrl from "../../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);

const HomeChecador = () => {
  const [foto, setFoto] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const urlPunto = apiUrl + "checador/chequeo/";
  const [punto, setPunto] = useState("");

  const getImg = async () => {
    const imgUrl = apiUrl + "perfil/images/" + 1;

    try {
      const img = await axios.get(imgUrl);
      setFoto(img.data);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("my-key");
      var key = JSON.parse(jsonValue);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      getUsuario(key.dataAll.id_usuario);
    } catch (e) {
      console.log("error");
    }
  };
  const getUsuario = async (user) => {
    const resPunto = await axios.get(urlPunto + user);

    setPunto(resPunto.data != "" ? resPunto.data.nombre : "SIN RUTA ASIGNADA");
  };

  useEffect(() => {
    getData();
    socket.emit("client:ListarRuta");
    socket.on("server:ListarRuta", (data) => {
      setUsuario(data);
    });

    socket.on("server:updateRuta", () => {
      socket.emit("client:ListarRuta");
    });
    getImg();
  }, []);

  const getImageUrl = (userId, photos) => {
    const photo = photos.find((photo) => photo.startsWith(`${userId}-`));
    if (photo) {
      return scoketUrl + "/" + photo;
    }
    return null;
  };

  const renderItem = ({ item }) => {
    const imageUrl = getImageUrl(item.id_usuario, foto);
    return (
      <View style={styles.item}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("../../assets/utils/user.png")
            }
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16 }}
          />
          <Text>{item.nombre_completo}</Text>
        </View>
        <Text>PLACAS: {item.placas}</Text>
        <Text>MODELO: {item.modelo}</Text>
        <Text>NO.ECONOMICO: {item.no_economico}</Text>
        <Text>DESTINO: {item.destino}</Text>
      </View>
    );
  };

  //modal de scanner

  const [isScannerOpen, setScannerOpen] = useState(false);

  const openScanner = () => {
    setScannerOpen(true);
  };

  const closeScanner = () => {
    setScannerOpen(false);
  };
  return (
    <View style={styles.container}>
      <View>
        {/* <Text>Presiona para abrir el escáner:</Text> */}
        <Pressable style={styles.button} onPress={openScanner}>
          <Text style={styles.buttonText}>ESCÁNER QR</Text>
        </Pressable>

        <QRCodeScanner
          isOpen={isScannerOpen}
          onClose={closeScanner}
          punto={punto}
        />
      </View>

      <DatosDiaChecador punto={punto} />

      <Text>Unidades en ruta</Text>
      <FlatList
        data={usuario}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_usuario.toString()}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.container}>
        <Text>{usuario ? "NO HAY UNIDADES EN RUTA" : ""}</Text>
      </View>
    </View>
  );
};

export default HomeChecador;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    //
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
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
