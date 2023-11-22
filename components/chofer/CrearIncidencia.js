import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  Picker,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import apiUrl from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CrearIncidencia() {
  const urlIncidencia = apiUrl + "chofer/incidencias/";
  const urlRuta = apiUrl + "chofer/ruta/";
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [desc, setDesc] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [idruta, setIdruta] = useState(0);
  const [errIns, setErrIns] = useState(false);
  const [errDesc, setErrDesc] = useState(false);
  const [errImg, setErrImg] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    getIncidencias();
  }, []);

  const getIncidencias = async () => {
    try {
      const response = await axios.get(urlIncidencia);
      const processedData = response.data.map((item) => ({
        id: item.id_ctgincidencias,
        name: item.incidencia,
      }));
      setOptions(processedData);
      // console.log(processedData);
    } catch (error) {
      console.log("Error al obtener los datos:", error);
    }

    try {
      const jsonValue = await AsyncStorage.getItem("my-key");
      var key = JSON.parse(jsonValue);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      setUser(key.dataAll.id_usuario);
      try {
        const rutaResponse = await axios.get(urlRuta + key.dataAll.id_usuario);
        setIdruta(rutaResponse.data[0].id_ruta);
        // console.log(rutaResponse.data[0].id_ruta);
      } catch (error) {
        console.log("Error al obtener la ruta:", error);
      }
    } catch (e) {
      console.log("error");
    }
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setErrIns(false);
  };

  const handleDescChange = (value) => {
    setDesc(value);
    setErrDesc(false);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleImageResponse(result);
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleImageResponse(result);
  };

  const handleImageResponse = (result) => {
    if (!result.cancelled) {
      setSelectedImages([...selectedImages, { uri: result.uri }]);
      setErrImg(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      setErrIns(true);
    }

    if (!desc) {
      setErrDesc(true);
    }

    if (selectedImages.length === 0) {
      setErrImg(true);
    }

    if (!selectedOption || !desc || selectedImages.length === 0) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id_chofer", user.id_usuario);
      formData.append("incidencia", selectedOption.id);
      formData.append("id_ruta", idruta !== 0 ? idruta : 0);
      formData.append("descripcion", desc);
      selectedImages.forEach((image, index) => {
        formData.append(`imagen${index}`, {
          uri: image.uri,
          type: "image/jpeg", // Ajusta según el tipo de imagen que estés utilizando
          name: `imagen${index}.jpg`,
        });
      });

      const response = await axios.post(
        `${apiUrl}chofer/incidencias/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      // Resto de la lógica de respuesta
    } catch (error) {
      console.error("Error al enviar la incidencia:", error);
    }
  };
  const handleImageDelete = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };
  return (
    <ScrollView>

    <View style={styles.container}>
        <View>
          <View style={styles.inputsText}>
            <Text>Tipo de Incidencia:</Text>

            <Picker
              style={styles.Picker}
              selectedValue={selectedOption}
              onValueChange={(value) => handleOptionChange(value)}
            >
              {options.map((option) => (
                <Picker.Item
                  key={option.id}
                  label={option.name}
                  value={option}
                />
              ))}
            </Picker>
            {errIns && <Text style={{ color: "red" }}>Campo requerido</Text>}

            <Text>Descripción:</Text>
            {/* Área de texto para la descripción */}
            <TextInput
              style={styles.TextInput}
              multiline
              numberOfLines={4}
              value={desc}
              onChangeText={handleDescChange}
            />
            {errDesc && <Text style={{ color: "red" }}>Campo requerido</Text>}

            {/* Botones para seleccionar imagen y tomar foto */}
            <Button title="Subir Imagen" onPress={handleImagePick} />
            <Button title="Tomar Foto" onPress={handleTakePhoto} />
            {errImg && <Text style={{ color: "red" }}>Campo requerido</Text>}
          </View>

          {/* Mostrar imágenes seleccionadas */}
          {selectedImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={{ width: 100, height: 100 }}
            />
          ))}

          {selectedImages.map((image, index) => (
            <View key={index}>
              <Image
                source={{ uri: image.uri }}
                style={{ width: 100, height: 100 }}
              />
              <TouchableOpacity onPress={() => handleImageDelete(index)}>
                <Text>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
      
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonLabel}>ACEPTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
    </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1f1f1",
        //
        justifyContent: "center",
        alignItems: "center",
        marginTop:10
      },
     
  TextInput: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  Picker: {
    borderWidth: 1,
    borderColor: "000",
    padding: 10,
    // width:'80%',
    height: 50,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },

  inputsText: {
    margin: 50,
    padding: 0,
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
    marginHorizontal: 120,
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
