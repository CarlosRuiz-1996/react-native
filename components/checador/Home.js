import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import { Camera, CameraType } from "expo-camera";

import scoketUrl from "../../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);

export default function HomeChecador() {
  const [usuario, setUsuario] = useState([]);

  useEffect(() => {
    socket.emit("client:ListarRuta");
    socket.on("server:ListarRuta", (data) => {
      console.log(data);
      setUsuario(data);
    });
  }, []);
  // funciones para camara:
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Camera style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>

      <Text style={{ textAlign: "center", fontSize: 20 }}>
        CONDUCTORES QUE ESTÁN EN VIAJE
      </Text>
      <FlatList
        data={usuario}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "#4a6473",
              padding: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: item.imageUrl }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 10,
                }}
              />
              <Text>{item.nombre_completo}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ flex: 1 }}>PLACAS: {item.placas}</Text>
              <Text style={{ flex: 1 }}>MODELO: {item.modelo}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ flex: 1 }}>NO.ECONÓMICO: {item.no_economico}</Text>
              <Text style={{ flex: 1 }}>DESTINO: {item.destino}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});