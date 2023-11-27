
import { StyleSheet, View, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import Perfil from "./auth/Perfil";


export default function SettingsScreen() {

  const navigation = useNavigation();

    const handleLogout = async () => {
        try {
          await AsyncStorage.removeItem("my-key"); // Elimina el elemento con la clave "my-key"
          // Puedes agregar cualquier otra lógica de cierre de sesión aquí
          navigation.navigate('Login'); // Reemplaza 'Login' con la pantalla de inicio de sesión real

        } catch (error) {
          // Maneja cualquier error que ocurra durante el proceso de eliminación
          console.error("Error al cerrar sesión: ", error);
        }
      };

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* <Text>Configuración!</Text> */}
        
        <Perfil/>
        <Pressable onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </Pressable>
      </View>
    );
  }


  
const styles = StyleSheet.create({

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
