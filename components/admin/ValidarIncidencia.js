import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,Autocomplete,TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { Button } from "react-native-elements";
import axios from "axios";
import moment from "moment";
import { useRoute } from "@react-navigation/native";
import {
  RadioButton,
  Text as PaperText,
  TextInput as PaperTextInput,
} from "react-native-paper";
import apiUrl from "../../api/api";

import scoketUrl from "../../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);
const ValidarIncidencia = ({ navigation }) => {
  const route = useRoute();
  const { incidencia } = route.params;
  const [selectedImages, setSelectedImages] = useState([]);
  const [tipo, setTipo] = useState("");
  const [desc, setDesc] = useState("");
  const [fecha, setFecha] = useState("");
  const [destino, setDestino] = useState("");
  const [inicio, setInicio] = useState("");
  const [punto1, setPunto1] = useState("");
  const [punto2, setPunto2] = useState("");
  const [fin, setFin] = useState("");
  const [dif, setDif] = useState("");
  const [id_usuario, setId_usuario] = useState("");

  const [validacion, setValidacion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [errOp, setErrOp] = useState("");

  const urlDatos = apiUrl + "checador/incidencias/validar/" + incidencia;
  const urlImg = apiUrl + "checador/incidencias/imagen/" + incidencia;
  const urlSave = apiUrl + "checador/";
  const urlCastigo = apiUrl + "checador/castigos";

  useEffect(() => {
    getIncidencias();

    // Emitir evento al servidor para actualizar la ruta
    socket.emit("server:updateRuta", () => {
      getIncidencias();
    });

    getCastigos();
    moment.locale("es");
  }, []);

  const getIncidencias = async () => {
    try {
      const response = await axios.get(urlDatos);
      setTipo(response.data[0].incidencia);
      setDesc(response.data[0].descripcion);
      setFecha(response.data[0].fecha_alta);
      setDestino(response.data[0].destino);
      setInicio(response.data[0].punto_salida);
      setPunto1(response.data[0].punto_chequeo1);
      setPunto2(response.data[0].punto_chequeo2);
      setFin(response.data[0].punto_termino);
      setDif(response.data[0].diferencia_minutos);
      setId_usuario(response.data[0].id_usuario);

      const img = await axios.get(urlImg);
      const busqueda = img.data.filter((i) => i.split("-")[0] === incidencia);
      setSelectedImages(busqueda);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCastigos = async () => {
    try {
      const response = await axios.get(urlCastigo);
      const processedData = response.data.map((item) => ({
        id: item.id_castigo,
        name: item.castigo,
      }));
      setOptions(processedData);
    } catch (error) {
      console.log("Error al obtener los datos:", error);
    }
  };

  const handleSubmit = async () => {
    if (validacion === null) {
      alert("ACEPTA O RECHAZA ESTA INCIDENCIA");
    } else if (validacion == 0) {
      if (!selectedOptionId) {
        setErrOp(1);
      } else {
        setErrOp(null);
        const parametros = {
          status: validacion,
          id_incidencia: incidencia,
          id_castigo: selectedOptionId,
          id_usuario: id_usuario,
        };
        enviarSolicitud(parametros);
      }
    } else {
      const parametros = {
        status: validacion,
        id_incidencia: incidencia,
        id_usuario: id_usuario,
      };
      enviarSolicitud(parametros);
    }
  };

  const enviarSolicitud = async (parametros) => {
    try {
      const response = await axios({
        method: "PUT",
        url: urlSave,
        data: parametros,
      });

      const tipo = response.data.tipo;
      const msj = response.data.msj;

      alert(msj);
          navigation.navigate("ListarIncidenciaAdmin");
     
    } catch ({ response }) {
        alert(response.data.msj, response.data.tipo);
    }
  };
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChangeOption = (value) => {
    setValidacion(value);
    if (value === 0) {
      setErrOp(1);
    } else {
      setErrOp(null);
    }
  };

  const handleOptionChange = (value) => {
    if (value) {
      setErrOp(null);
      setSelectedOptionId(value.id);
    } else {
      setSelectedOptionId(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>INCIDENCIA:</Text>
          <TextInput style={styles.text}
            // style={{ backgroundColor: "#f0f0f0", padding: 10, borderRadius: 5 }}
            value={tipo.toUpperCase()}
            editable={false}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>FECHA:</Text>
          <TextInput
          style={styles.text}
            // style={{ backgroundColor: "#f0f0f0", padding: 10, borderRadius: 5 }}
            value={moment(fecha)
              .format("dddd, D [DE] MMMM [DE] YYYY, HH:mm:ss")
              .toUpperCase()}
            editable={false}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>DESCRIPCIÓN:</Text>
          <TextInput
          style={styles.text}
            // style={{ backgroundColor: "#f0f0f0", padding: 10, borderRadius: 5 }}
            value={desc.toUpperCase()}
            editable={false}
            multiline
          />
        </View>
        <Text style={{ fontWeight: "bold", marginTop:5 }}>DATOS DE LA RUTA:</Text>

        {/* Resto del contenido... */}
        <View style={{ marginTop: 10, flexDirection: "row" }}>
          <View style={{ flex: 3 }}>
            <TextInput style={styles.text}
              label="DESTINO"
              placeholder="DESTINO"
              value={destino ? destino.toUpperCase() : ""}
              disabled
            />
          </View>
          <View style={{ flex: 3 }}>
            <TextInput style={styles.text}
              label="HORA SALIDA"
              placeholder="HORA SALIDA"
              value={moment(inicio).format("HH:mm:ss").toUpperCase()}
              disabled
            />
          </View>
          <View style={{ flex: 3 }}>
            <TextInput style={styles.text}
              label="HORA CHEQUEO PUNTO 1"
              placeholder="HORA CHEQUEO PUNTO 1"
              value={
                punto1
                  ? moment(punto1).format("HH:mm:ss").toUpperCase()
                  : "AUN NO CHECA"
              }
              disabled
            />
          </View>
          
        </View>

        <View style={{ marginTop: 10, flexDirection: "row" }}>
          <View style={{ flex: 3 }}>
            <TextInput style={styles.text}
              label="HORA CHEQUEO PUNTO 2"
              placeholder="HORA CHEQUEO PUNTO 2"
              value={
                punto2
                  ? moment(punto2)
                      .tz("America/Mexico_City")
                      .format("HH:mm:ss")
                      .toUpperCase()
                  : "AUN NO CHECA"
              }
              disabled
            />
          </View>
          <View style={{ flex: 3 }}>
            <TextInput style={styles.text}
              label="HORA FINALIZO"
              placeholder="HORA FINALIZO"
              value={
                fin
                  ? moment(fin).format("HH:mm:ss").toUpperCase()
                  : "AUN NO FINALIZA"
              }
              disabled
            />
          </View>
          <View style={{ flex: 3 }}>
            <TextInput style={styles.text}
              label="TIEMPO DE RETRASO"
              placeholder="RETRASO"
              value={
                destino == "SANTA MARTHA"
                  ? dif > 20
                    ? dif - 20 + " min"
                    : "SIN RETRAZO"
                  : dif > 52
                  ? dif - 52 + " min"
                  : "SIN RETRAZO"
              }
              disabled
            />
          </View>
        </View>
        <View>
          {selectedImages.length > 0 ? (
            <FlatList
              data={selectedImages}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              renderItem={({ item }) => (
                <View style={{ margin: 8 }}>
                  <Image
                    source={{ uri: item }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                  />
                </View>
              )}
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              SIN EVIDENCIAS
            </Text>
          )}
        </View>

        <View>
        <Text>VALIDAR</Text>
        
        <TouchableOpacity onPress={() => handleChangeOption(2)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ height: 24, width: 24, borderRadius: 12, borderWidth: 2, marginRight: 8 }}>
              {validacion === 2 && <View style={{ flex: 1, borderRadius: 10, backgroundColor: '#000' }} />}
            </View>
            <Text>Aceptar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChangeOption(0)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ height: 24, width: 24, borderRadius: 12, borderWidth: 2, marginRight: 8 }}>
              {validacion === 0 && <View style={{ flex: 1, borderRadius: 10, backgroundColor: '#000' }} />}
            </View>
            <Text>Rechazar</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View>
        {/* Lógica para mostrar opciones de castigos usando Picker */}
        {validacion === 0 && (
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => handleOptionChange(itemValue)}
          >
            <Picker.Item label="Seleccione un castigo" value={null} />
            {options.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item} />
            ))}
          </Picker>
        )}
      </View>


        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          
          <Button type="outline" title="ACEPTAR" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ValidarIncidencia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "#f1f1f1",
  //   //
  //   justifyContent: "center",
  // },

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
