import axios from "axios";
import apiUrl from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const generateQRCode = (user, setSavedQRCode, json, tipo = 0) => {
  const urlActivar = apiUrl+"chofer/activar";
  if (tipo === 0) {

    // console.log(user)
    // console.log(json)
    axios({
      method: "POST",
      url: urlActivar,
      data: { id_usuario: user },
    }).then(function (respuesta) {
      var tipo = respuesta.data.tipo;
      var msj = respuesta.data.msj;
      if (tipo === "success") {
        console.log(json);
        storeQr(json)
        setSavedQRCode(JSON.stringify(json));
      }
      alert(msj, tipo);
    });
  } else {
    storeQr(json)
    setSavedQRCode(JSON.stringify(json));
  }
};

export default generateQRCode;


const storeQr = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("qr", jsonValue);
    } catch (e) {
      console.log("no se guardo el qr");
    }
  };