import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import axios from "axios";
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español para moment
// import "moment-timezone";

// import * as RNLocalize from 'react-native-localize';
const data = [
  { id: "1", name: "Row 1", value: "Value 1" },
  { id: "2", name: "Row 2", value: "Value 2" },
  // ... otros datos
];

const itemsPerPage = 5;
import AsyncStorage from "@react-native-async-storage/async-storage";
import scoketUrl from "../../api/urlSocket";
import apiUrl from "../../api/api";

import io from "socket.io-client";
const socket = io(scoketUrl);
export default function Incidecias({ navigation }) {
  const [user, setUser] = useState();
  const [incidencias, setIcidencias] = useState([]);
  // moment.locale(RNLocalize.getLocales()[0].languageCode);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("my-key");
      var key = JSON.parse(jsonValue);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      setUser(key.dataAll.id_usuario);
      getIncidencias(key.dataAll.id_usuario);
    } catch (e) {
      console.log("error");
    }
  };
  const url = apiUrl + "chofer/incidencias/sts/";

  useEffect(() => {
    moment.locale("es");

    getData();
  }, []);

  const getIncidencias = async (user) => {
    const respuesta = await axios.get(url + user);
    setIcidencias(respuesta.data);
  };

  useEffect(() => {
    socket.on("server:updateIncidencia", () => {
      getIncidencias(user);
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = incidencias.filter((item) =>
    item.incidencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text
        style={styles.itemText}
      >{`Incidencia: ${item.incidencia}\nDescripción: ${item.descripcion}Fecha Alta: ${moment(item.fecha_alta).format('dddd, DD [DE] MMMM [DE] YYYY, HH:mm:ss')}\nStatus: ${item.status=== 1?'PENDIENTE':''}    ${item.status=== 0?'RECHAZADO':''}
      ${item.status=== 2?'ACEPTADO':''}`}
      </Text>
    </View>
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const handleNewIncidence = () => {
    // Aquí puedes realizar cualquier acción relacionada con la creación de una nueva incidencia
    // Por ejemplo, puedes navegar a la pantalla de creación de incidencia
    navigation.navigate("CrearIncidencia");
  };
  return (
    // <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            placeholder="Buscar..."
            onChangeText={setSearchTerm}
            value={searchTerm}
          />
          <Pressable style={styles.button} onPress={handleNewIncidence}>
            <Text style={styles.buttonText}>Nueva incidencia</Text>
          </Pressable>
        </View>

        <FlatList
          data={paginatedData}
          renderItem={renderItem}
          // keyExtractor={(item, index) => index}
          keyExtractor={(item, index) => index.toString()} // Asegúrate de usar index.toString()

        />
        <View style={styles.pagination}>
          {/* <Button title="Prev Page" onPress={handlePrevPage} /> */}
          <Pressable
            style={styles.button}
            onPress={handlePrevPage}
            disabled={currentPage === 1}
          >
            <Text style={styles.buttonText}>Anterior</Text>
          </Pressable>

          <Text>{`Page ${currentPage}`}</Text>
          {/* <Button title="Next Page" onPress={handleNextPage} /> */}
          <Pressable
            style={styles.button}
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
          </Pressable>
        </View>
      </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    //
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },
  item: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignSelf: 'flex-start',

  },
  itemText: {
    fontSize: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
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
