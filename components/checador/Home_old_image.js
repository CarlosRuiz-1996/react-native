import react, {useState} from "react";
import {  StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "./Button";

import * as ImagePicker from "expo-image-picker";
import ImageViewer from "./ImageViewer";
const PlaceholderImage = require("../../assets/images/background-image.png");

export default function HomeChecador() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAppOptions, setShowAppOptions] = useState(false);
  

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri);
          setShowAppOptions(true);
        } else {
          alert("You did not select any image.");
        }
      };


  return (
    <View style={styles.container}>
    <View style={styles.imageContainer}>
      <ImageViewer
        placeholderImageSource={PlaceholderImage}
        selectedImage={selectedImage}
      />
    </View>
    {showAppOptions ? (
      <View />
    ) : (
      <View style={styles.footerContainer}>
        <Button
          label="Choose a photo"
          theme="primary"
          onPress={pickImageAsync}
        />
        <Button
          label="Use this photo"
          onPress={() => setShowAppOptions(true)}
        />
      </View>
    )}
    <StatusBar style="auto" />
  </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
    },
    imageContainer: {
      flex: 1,
      paddingTop: 58,
    },
  
    footerContainer: {
      flex: 1 / 3,
      alignItems: "center",
    },
  });
  


  
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Button,
//   ScrollView,
// } from "react-native";
// import { useState, useEffect } from "react";
// import { Camera, CameraType } from "expo-camera";
// import { BarCodeScanner } from "expo-barcode-scanner";
// import { getImageUrl } from "../utils/getFotos";
// import apiUrl from "../../api/api";

// import scoketUrl from "../../api/urlSocket";
// import io from "socket.io-client";
// const socket = io(scoketUrl);

// export default function HomeChecador() {
//   const [usuario, setUsuario] = useState([]);

//   useEffect(() => {
//     socket.emit("client:ListarRuta");
//     socket.on("server:ListarRuta", (data) => {
//       console.log(data);
//       setUsuario(data);
//     });
//   }, []);


//   // listar fotos
//   const [foto, setFoto] = useState([]);

//   const getImg = async () => {
//     const imgUrl = apiUrl+"perfil/images/" + 1;

//     const img = await axios.get(imgUrl);
//     setFoto(img.data);
//   };

//   useEffect(() => {
//     getImg();
//   }, []);

//   //permisos de la scaneada
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [scannedData, setScannedData] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     setScannedData(data);
//   };

//   if (hasPermission === null) {
//     return <Text>Solicitando permisos de la cámara...</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>Permiso de la cámara denegado</Text>;
//   }
//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <View style={styles.container}>
//           {scannedData ? (
//             <View>
//               <Text>Datos del código QR:</Text>
//               <Text>{scannedData}</Text>
//               {/* Aquí puedes parsear tu JSON y utilizar los datos según tus necesidades */}
//             </View>
//           ) : (
//             <BarCodeScanner
//               onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//               style={StyleSheet.absoluteFillObject}
//             />
//           )}

//           {scanned && (
//             <Button
//               title="Escanear de nuevo"
//               onPress={() => setScanned(false)}
//             />
//           )}
//         </View>

//         <Text style={{ textAlign: "center", fontSize: 20 }}>
//           CONDUCTORES QUE ESTÁN EN VIAJE
//         </Text>
        
//         <FlatList
//           data={usuario}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View
//               style={{
//                 backgroundColor: "#fff",
//                 padding: 20,
//                 marginVertical: 8,
//                 marginHorizontal: 16,
//                 borderRadius: 8,
//                 borderWidth: 1,
//                 borderColor: "#ddd",
//               }}
//             >
//               <View style={{ flexDirection: "row", alignItems: "center" }}>
//                 <Image
//                   source={{ uri: item.imageUrl }}
//                   style={{
//                     width: 50,
//                     height: 50,
//                     borderRadius: 25,
//                     marginRight: 10,
//                   }}
//                 />
//                 <Text>{item.nombre_completo}</Text>
//               </View>
//               <View style={{ flexDirection: "row" }}>
//                 <Text style={{ flex: 1 }}>PLACAS: {item.placas}</Text>
//                 <Text style={{ flex: 1 }}>MODELO: {item.modelo}</Text>
//               </View>
//               <View style={{ flexDirection: "row" }}>
//                 <Text style={{ flex: 1 }}>
//                   NO.ECONÓMICO: {item.no_economico}
//                 </Text>
//                 <Text style={{ flex: 1 }}>DESTINO: {item.destino}</Text>
//               </View>
//             </View>
//           )}
//         />
//       </View>
//     </ScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f1f1f1",
//     //
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 10,
//   },

//   buttonContainer: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "transparent",
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: "flex-end",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
// });
 