import React, { useState, useEffect } from "react";
import { Modal, View, Text, Button, StyleSheet, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import apiUrl from "../../api/api";
import axios from "axios";
const QRCodeScanner = ({ isOpen, onClose, punto }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  const [checado, setChecado] = useState(0);
  const [idRuta, setIdRuta] = useState(0);
  const [castigo, setCastigo] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleScan = ({ data }) => {
    setScanned(true);
    const parsedResult = JSON.parse(data);

    setResult(parsedResult);
  };

  const handleClose = () => {
    setScanned(false);
    setResult(null);
    setChecado(0);
    setIdRuta(0);
    setCastigo(0);
    onClose();
  };

  const handleSubmit = () => {
    
    const url = apiUrl+"checador/ruta";
    var destino;
    var choferValue = result.usuario;
    var rutaValue = result.ruta;
    var id_ruta  = result.id_ruta;
    var destinoValue = result.destino;
    console.log(choferValue)
    console.log(rutaValue)
    console.log(punto)
    console.log(id_ruta);
    console.log(destinoValue)
    if (
      (punto == "SANTA ELENA" || punto == "SANTA MARTHA") &&
      rutaValue == "Sin ruta"
    ) {
      if (punto == "SANTA ELENA") {
        destino = "SANTA MARTHA";
      } else if (punto == "SANTA MARTHA") {
        destino = "SANTA ELENA";
      }
      // alert('if')
      axios({
        method: "POST",
        url: url,
        data: { id_usuario: choferValue, destino: destino },
      }).then(function (respuesta) {
        // var tipo = respuesta.data.tipo;
        var msj = respuesta.data.msj;
        alert(msj);
      });
    }
     else {
      // alert('else')

      axios({
        method: "PUT",
        url: url,
        data: { id_usuario: choferValue, punto: punto, destino: destinoValue, id_ruta:id_ruta },
      }).then(function (respuesta) {
        var msj = respuesta.data.msj;
        alert(msj);
      });
    }
    // console.log("Datos escaneados:", result);
    handleClose();
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de la cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Permiso de la cámara denegado</Text>;
  }


  
  return (
    <Modal visible={isOpen} onRequestClose={handleClose} animationType="slide">
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleScan}
            style={styles.camera}
          />
        </View>

        {result && (
          <View style={styles.resultContainer}>
            {/* <Text style={styles.label}>Usuario:</Text>
            <Text style={styles.value}>{result.usuario}</Text> */}

            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.value}>{result.hora}</Text>

            <Text style={styles.label}>Modelo:</Text>
            <Text style={styles.value}>{result.modelo}</Text>

            <Text style={styles.label}>Placas:</Text>
            <Text style={styles.value}>{result.placas}</Text>

            <Text style={styles.label}>Económico:</Text>
            <Text style={styles.value}>{result.economico}</Text>

            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{result.nombre}</Text>

            {/* <Text style={styles.label}>Ruta:</Text>
            <Text style={styles.value}>{result.ruta}</Text>
            {result.ruta === "Sin ruta" && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  {punto === "SANTA ELENA"
                    ? "DESTINO: SANTA MARTHA"
                    : punto === "SANTA MARTHA"
                    ? "DESTINO: SANTA ELENA"
                    : ""}
                </Text>
              </View>
            )} */}

            <Text style={styles.label}>Destino:</Text>
            <Text style={styles.value}>
            {result.ruta == "Sin ruta"
                                    ? "Actualmente sin ruta"
                                    : result.destino}
            </Text>
            {/* <Text style={styles.label}>ID Ruta:</Text>
            <Text style={styles.value}>{result.id_ruta}</Text> */}
            {/* <Text style={styles.label}>Ruta:</Text>
            <Text style={styles.value}>{result.ruta}</Text> */}

            <Text style={styles.label}>Castigado:</Text>
            <Text style={styles.value}>
              {result.castigado === null ? "No" : "Sí"}
            </Text>

            {result.ruta === "checar tiempo 1" && (
              <View>
                <Text style={styles.label}>PRIMER PUNTO DE CHEQUEO</Text>
              </View>
            )}
             {result.ruta === "checar tiempo 2" && (
              <View>
                <Text style={styles.label}>SEGUNDO PUNTO DE CHEQUEO</Text>
              </View>
            )}
             {result.ruta === "terminar" && (
              <View>
                <Text style={styles.label}>RUTA FINALIZADA</Text>
              </View>
            )}
          </View>
        )}

        {scanned && (
          <View style={styles.buttonContainer}>
            <Button title="ACEPTAR" onPress={handleSubmit} />
          </View>
        )}
      </View>
      <Pressable style={styles.buttonRed} onPress={handleClose}>
        <Text style={{ color: "white" }}>Cancelar</Text>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  resultContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  resultText: {
    fontSize: 16,
  },
  buttonContainer: {
    padding: 20,
  },
  buttonRed: {
    backgroundColor: "red",
  },
  label: {
    fontWeight: "bold",
    marginTop: 5,
  },
  value: {
    marginBottom: 10,
  },
});

export default QRCodeScanner;

// import React, { useState, useEffect } from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';

// export default function QRCodeScanner() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     alert(`Código ${type}: ${data}`);
//   };

//   const startScan = () => {
//     setScanned(false);
//   };

//   if (hasPermission === null) {
//     return <Text>Solicitando permisos para usar la cámara</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>Permiso denegado para usar la cámara</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//       />
//       {!scanned && (
//         <Button title="Iniciar Escaneo" onPress={startScan} />
//       )}
//       {scanned && (
//         <View style={styles.overlay}>
//           <Text style={styles.overlayText}>Escaneado exitosamente</Text>
//           <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'flex-end',
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlayText: {
//     color: 'white',
//     fontSize: 18,
//     marginBottom: 10,
//   },
// });
