import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { Button } from "react-native-elements";
import moment from "moment";
import "moment/locale/es"; // Importa el idioma español para moment

import AsyncStorage from "@react-native-async-storage/async-storage";
import scoketUrl from "../../api/urlSocket";
import io from "socket.io-client";
const socket = io(scoketUrl);
export default function Castigos() {
  const [user, setUser] = useState();
  const [incidencias, setIcidencias] = useState([]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("my-key");
      var key = JSON.parse(jsonValue);
      jsonValue != null ? JSON.parse(jsonValue) : null;
      setUser(key.dataAll.id_usuario);
      socket.emit("client:getCastigoChofer", key.dataAll.id_usuario);
      socket.on("server:getCastigoChofer", (data) => {
        console.log(data);
        setIcidencias(data);
      });
    } catch (e) {
      console.log("error");
    }
  };
  useEffect(() => {
    moment.locale("es");

    getData();
  }, []);
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const totalItems = incidencias.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = incidencias.slice(startIndex, endIndex);

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

  const handleSearch = (text) => {
    setSearchTerm(text);
    setCurrentPage(1); // Reiniciar a la primera página al realizar una búsqueda
  };

  const filteredData = incidencias.filter((item) =>
    item.castigo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{`CASTIGO: ${item.castigo}`}</Text>
      <Text style={styles.itemText}>{`FECHA: ${moment(item.fecha_alta).format(
        "dddd, DD [DE] MMMM [DE] YYYY, HH:mm:ss"
      )}`}</Text>
      <Text style={styles.itemText}>{`MONTO: ${
        item.monto ? item.monto : "sin amonestacion economica"
      }`}</Text>
      <Text style={styles.itemText}>{`ESTATUS: ${
        item.status === 1 ? "PENDIENTE" : ""
      }${item.status === 0 ? "CUMPLIDO" : ""}${
        item.status === 2 ? "ACEPTADO" : ""
      }`}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          onChangeText={handleSearch}
          value={searchTerm}
        />
      </View>
      <FlatList
        data={incidencias}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.pagination}>
        <Pressable
          style={styles.button}
          onPress={handlePrevPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.buttonText}>Anterior</Text>
        </Pressable>
        <Text>{`Página ${currentPage} de ${totalPages}`}</Text>
        <Pressable
          style={styles.button}
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
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
  
