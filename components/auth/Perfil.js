import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import apiUrl from "../../api/api";
import scoketUrl from "../../api/urlSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Perfil = () => {
  const [user, setUser] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [img, setImg] = useState("");
  const imgUrl = apiUrl + "perfil/images/";
  const urlPerfil = apiUrl + "user/perfil/";

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("my-key");
      var key = JSON.parse(jsonValue);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      //   setUsuario(key.dataAll);
      const respuesta = await axios.get(urlPerfil + key.dataAll.id_usuario);
      setUsuario([respuesta.data[0]]);

      const imgResponse = await axios.get(imgUrl + key.dataAll.id_usuario);
      var busqueda;
      imgResponse.data.map((i) => {
        const parts = i.split("-");
        busqueda = parts[0];
        if (busqueda == key.dataAll.id_usuario) {
          setImg([i]);
        }
      });
    } catch (e) {
      console.log("error");
    }
  };

  useEffect(() => {
    //   getUsuario();
    getData();
    moment.locale("es");
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f1f1f1",
        padding: 16,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {usuario.map((usu, key) => (
          <View key={key}>
            {!img ? (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "blue",
                  marginBottom: 16,
                }}
              />
            ) : (
              <Image
                source={{ uri: scoketUrl + "/" + img }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  marginBottom: 16,
                }}
              />
            )}
            <Text
              style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
            >
              {usu.nombre_completo.toUpperCase()}
            </Text>
            <Text style={{ color: "gray", textAlign: "center" }}>
              Vive en{" "}
              {usu.municipio ? usu.municipio + ", Mexico" : "NO ESPECIFICADO"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 16,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", color: "gray" }}>Edad</Text>
                <Text style={{ color: "gray" }}>{usu.edad} AÑOS</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", color: "gray" }}>
                  Te uniste en
                </Text>
                <Text style={{ color: "gray" }}>
                  {moment(usu.fecha_alta).format('dddd, DD [DE] MMMM [DE] YYYY, HH:mm:ss')}
                </Text>
              </View>
            </View>
            {/* <TouchableOpacity
              style={{
                backgroundColor: "#007BFF",
                paddingVertical: 12,
                borderRadius: 5,
                alignItems: "center",
              }}
              onPress={() => navigate("/edit-profile")}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                Editar Perfil
              </Text>
            </TouchableOpacity> */}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Perfil;
