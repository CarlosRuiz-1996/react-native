import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import { Card } from "react-native-paper";
import axios from "axios";
import apiUrl from "../../api/api";
import scoketUrl from "../../api/urlSocket";
import io from "socket.io-client";

const socket = io(scoketUrl);

const TodasUnidades = () => {
  const [unidades, setUnidades] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    socket.emit("client:ListarTodas");
    socket.on("server:ListarTodas", (data) => {
      setUnidades(data[0]);
    });

    socket.on("server:updateActiva", () => {
      socket.emit("client:ListarTodas");
    });

    return () => {
      socket.off("client:ListarTodas");
      socket.off("server:ListarTodas");
    };
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(value);
    setPage(0);
  };

  const handleDesactivar = (data, op) => {
    if (!data) {
      alert("NO TIENE UN CHOFER ASIGNADO");
    } else {
      axios({
        method: "PUT",
        url: apiUrl + "checador/desactivar/",
        data: { id_usuario: data, opcion: op },
      }).then((response) => {
        alert('Accion completada')
        // Manejar la respuesta exitosa si es necesario
      }).catch(function (error) {
        // Manejo de errores en caso de que ocurra algún problema con la solicitud
        console.error("Error al enviar la solicitud:", error);
      });
    }
  };

  const filterUnidades = () => {
    if (!searchQuery) {
      socket.emit("client:ListarTodas");
      return unidades;
    }

    return unidades.filter(
      (unidad) =>
        unidad.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unidad.año
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        unidad.placas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unidad.no_economico
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (unidad.chofer &&
          unidad.chofer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (unidad.duenio &&
          unidad.duenio.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (unidad.activo
          ? "activar".includes(searchQuery.toLowerCase())
          : "desactivar".includes(searchQuery.toLowerCase()))
    );
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const unidadesFiltradas = filterUnidades();

  const renderRow = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Modelo: {item.modelo}</Text>
      <Text style={styles.itemText}>Año: {item.año}</Text>
      <Text style={styles.itemText}>Placas: {item.placas}</Text>
      <Text style={styles.itemText}>No.Economico: {item.no_economico}</Text>
      <Text style={styles.itemText}>Chofer: {item.chofer}</Text>
      <Text style={styles.itemText}>Dueño: {item.duenio}</Text>

      {/* Agrega más Text o componentes según tus necesidades */}

      <TouchableOpacity
        onPress={() => {
          handleDesactivar(item.chofer_id, item.activo ? 1 : 2);
        }}
        style={{
          backgroundColor: item.activo ? "red" : "green",
          paddingVertical: 12,
          borderRadius: 5,
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          {item.activo ? "DESACTIVAR" : "ACTIVAR"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <TextInput
          label="Buscar"
          placeholder="Buscar"
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.input}
        />
      </View>
      <FlatList
        data={unidadesFiltradas}
        renderItem={renderRow}
        keyExtractor={(item) => item.id_unidad.toString()}
      />
    </View>
  );
};

export default TodasUnidades;
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
    alignSelf: "flex-start",
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
