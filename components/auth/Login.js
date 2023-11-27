import react, { useState } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import apiUrl from "../../api/api";


const logo = require("../../assets/utils/logo.png");
import axios from "axios";
// import { AsyncStorage } from "react-native"; // Importa AsyncStorage para el almacenamiento
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Login({ navigation }) {
  const navigateToSignIn = () => {
    // Navega a la pantalla 'Login'
    navigation.navigate("SignIn");
  };
  //estado para poder cambiar de color un link hover
  const [isHovered, setIsHovered] = useState(false);

  //datos para loguear
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const params = { usuario: usuario, password: password };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(baseUrl, params);
  //     const data = response.data;
  //     console.log("Respuesta exitosa:", data);
  //     storeData(data);
  //     navigation.navigate("Inicio");
  //   } catch (error) {
  //     console.error("Error en la solicitud:", error);
  //     alert(error.response.data.msj || "Ha ocurrido un error");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(apiUrl+'login', params)
        .then(({ data }) => {
          return data;
        })
        .then((data) => {
          // console.log(data)
          storeData(data);
          navigation.navigate("SplashScreen");
        })
        .catch(({ response }) => {
          alert(response.data.msj, "error");
        });
    } catch (error) {
      console.error("Error en la solicitud:"+error);
      alert("Ha ocurrido un error");
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("my-key", jsonValue);
    } catch (e) {
      console.log("no se guardo la session");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Center}>
        <Image source={logo} style={styles.image} />
        <Text style={styles.titulo}>Bienvenido</Text>
        <Text style={styles.subtitle}>Ingresa sesion con tu cuenta</Text>
      </View>
      <View style={styles.inputsText}>
        <TextInput
          style={styles.text}
          placeholder="Correo"
          value={usuario}
          onChangeText={(text) => setUsuario(text)}
        />
        <TextInput
          style={styles.text}
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonLabel}>Ingresar</Text>
        </Pressable>

        <TouchableOpacity
          onPress={navigateToSignIn}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Text
            style={{
              color: isHovered ? "blue" : "gray", // Cambia el color cuando está en hover
              marginTop: 10,
            }}
          >
            Ya tengo una cuenta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    //
    justifyContent: "center",
  },

  image: {
    width: 100,
    height: 100,
  },

  inputsText: {
    margin: 50,
    padding: 0,
  },
  text: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    // width:'80%',
    height: 50,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  titulo: {
    fontSize: 50,
    color: "#000",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    color: "gray",
  },
  Center: {
    alignItems: "center",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "blue",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: 320,
    height: 68,
    // marginHorizontal: 120,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    margin: 40,
  },
  buttonLabel: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
