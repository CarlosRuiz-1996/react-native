import axios from "axios";
import apiUrl from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteQr = (user, setSavedQRCode, tipo = 0) => {
  const urlDesactivar = apiUrl+"chofer/desactivar";
  if (tipo != 0) {
    deletecodigoQr();
    setSavedQRCode("");
  } else {
    // console.log('desactiva desde bd')
    axios({
      method: "PUT",
      url: urlDesactivar,
      data: { id_usuario: user },
    }).then(function (respuesta) {
      // console.log(respuesta);
      var tipo = respuesta.data.tipo;
      var msj = respuesta.data.msj;
      if (tipo === "success") {
        deletecodigoQr();
        setSavedQRCode("");
      }
      alert(msj, tipo);
    });
  }
};

export default deleteQr;

const deletecodigoQr = async () => {

try {
    await AsyncStorage.removeItem("qr"); // Elimina el elemento con la clave "my-key"
  } catch (error) {
    console.error("Error al cerrar sesión: ", error);
  }
}