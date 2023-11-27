import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-elements";
// import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import apiUrl from "../../api/api";

const IncidenciasAdmin = ({ navigation }) => {
  //   const navigation = useNavigation();
  const [incidencias, setIcidencias] = useState([]);

  useEffect(() => {
    moment.locale("es");
    getIncidencias();
  }, []);

  const getIncidencias = async () => {
    try {
      const response = await axios.get(apiUrl + "checador/incidencias/");
      setIcidencias(response.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text
        style={styles.itemText}
      >{`CHOFER: ${item.nombre_completo.toUpperCase()}`}</Text>
      <Text
        style={styles.itemText}
      >{`PLACAS: ${item.placas.toUpperCase()}`}</Text>
      <Text
        style={styles.itemText}
      >{`ECONOMICO: ${item.no_economico.toUpperCase()}`}</Text>
      <Text
        style={styles.itemText}
      >{`TIPO DE INCIDENCIA: ${item.incidencia.toUpperCase()}`}</Text>
      <Text
        style={styles.itemText}
      >{`DESCRIPCIÓN: ${item.descripcion.toUpperCase()}`}</Text>
      <Text style={styles.itemText}>
        {`FECHA DE INCIDENCIA: ${moment(item.fecha_alta)
          .format("dddd, D [DE] MMMM [DE] YYYY, HH:mm:ss")
          .toUpperCase()}`}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleValidaIncidence(item.id_incidencia)}
      >
        <Text style={styles.buttonText}>Validar Incidencia</Text>
      </TouchableOpacity>
    </View>
  );

  const handleValidaIncidence = (incidencia) => {
    navigation.navigate("ValidarIncidencia", { incidencia });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ESTATUS DE INCIDENCIAS</Text>
      {incidencias.length === 0 ? (
        <Text>No hay incidencias</Text>
      ) : (
        <FlatList
          data={incidencias}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_incidencia.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    //
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  itemContainer: { marginBottom: 20 },
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

export default IncidenciasAdmin;
