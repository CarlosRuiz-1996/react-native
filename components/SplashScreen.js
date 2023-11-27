import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator,StyleSheet } from "react-native";
// import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
const logo = require("../assets/utils/logo.png");

const SplashScreen = ({ navigation }) => {
  //   const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
const [user,setUser]= useState();
  useEffect(() => {
    const timer = setTimeout(() => {
      checkSession();
    }, 1000); // Redirigir después de 2 segundos (puedes ajustar el tiempo)

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);
  
  const checkSession = async () => {
    try { 
      const jsonValue = await AsyncStorage.getItem("my-key");
      const userData = JSON.parse(jsonValue);
      if (userData && userData.token) {
        // Usuario ya ha iniciado sesión, redirigir a la página de inicio
        setLoading(false);
        // setUser(userData);
        navigation.navigate("Inicio");
      } else {
        // Usuario no ha iniciado sesión, redirigir a la pantalla de inicio de sesión
        setLoading(false);

        navigation.navigate("Login");
      }
    } catch (error) {
      // Error al leer los datos de sesión, redirigir a la pantalla de inicio de sesión
      setLoading(false);

      navigation.navigate("Login");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <View >
          {/* <Image source={logo} /> */}
          {/* <View style={styles.imageContainer}>
            <Image source={logo} style={styles.image} />
          </View> */}
          <ActivityIndicator size="large" />
          <Text >
            Cargando...</Text>
        </View>
      ) : null}
    </View>
  );
};

export default SplashScreen;

// const styles = StyleSheet.create({
  
//   imageContainer: {
//     flex: 1,
//     marginBottom: 50,
//   },
//   image: {
//     width: 180,
//     height: 170,
//     borderRadius: 50,
//     marginTop:100, flex:1
//   },
// });
