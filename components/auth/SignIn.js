import react from "react";
import { StyleSheet, Text, View, TextInput, Image, Pressable } from "react-native";
const logo = require("../../assets/utils/logo.png");

export default function SignIn() {
    const pickImageAsync = async () => {
       
        alert("Ingresando");
      
    };
  return (
    <View style={styles.container}>
      <View style={styles.Center}>
        <Image source={logo} style={styles.image} />
        <Text style={styles.titulo}>Bienvenido</Text>
        <Text style={styles.subtitle}>Crea una nueva cuenta</Text>
      </View>
      <View style={styles.inputsText}>
        <TextInput style={styles.text} placeholder="Nombre" />
        <TextInput style={styles.text} placeholder="Apellidos" />
        <TextInput style={styles.text} placeholder="Usuario" />
        <TextInput style={styles.text} placeholder="Fecha de nacimiento" />

        <TextInput style={styles.text} placeholder="Correo" />
        <TextInput style={styles.text} placeholder="Contraseña" />
        <TextInput style={styles.text} placeholder="Confirmar" />
      </View>
      <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={pickImageAsync} >

        <Text style={styles.buttonLabel}>Ingresar</Text>
      </Pressable>
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
    width: 80,
    height: 80,
  },

  inputsText: {
    margin: 50,
    marginTop: 5,
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
  button:{
    width:'80%',
    height:50,
    backgroundColor:'blue',
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  buttonLabel: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
