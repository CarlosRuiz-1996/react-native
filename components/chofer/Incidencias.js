import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,ScrollView
} from "react-native";
import axios from "axios";

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
      >{`Incidencia: ${item.incidencia}\nDescripción: ${item.descripcion}\nFecha Alta: ${item.fecha_alta}\nStatus: ${item.status}`}</Text>
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
    navigation.navigate('CrearIncidencia');
  };
  return (
    <ScrollView>

    <View style={styles.container}>
      <View style={styles.header}>


        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
        <Button title="Nueva incidencia"  onPress={handleNewIncidence} />

      </View>


      <FlatList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.descripcion}
      />
      <View style={styles.pagination}>
        {/* <Button title="Prev Page" onPress={handlePrevPage} /> */}
        <Button
          title="Anterior"
          onPress={handlePrevPage}
          disabled={currentPage === 1}
        />

        <Text>{`Page ${currentPage}`}</Text>
        {/* <Button title="Next Page" onPress={handleNextPage} /> */}
        <Button
          title="Siguiente"
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        />
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
 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
 
  input: {
    flex:1,
    height: 40,
    borderColor: "gray",
    backgroundColor:'white',
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
    marginLeft:20,
    marginRight:20,
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
  },
  itemText: {
    fontSize: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
