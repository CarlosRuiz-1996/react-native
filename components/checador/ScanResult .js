import React from 'react';
import { Text, View } from 'react-native';

const ScanResult = ({ result }) => {
  return (
    <View>
      <Text style={styles.label}>Usuario:</Text>
      <Text style={styles.value}>{result.usuario}</Text>

      <Text style={styles.label}>Hora:</Text>
      <Text style={styles.value}>{result.hora}</Text>

      <Text style={styles.label}>Modelo:</Text>
      <Text style={styles.value}>{result.modelo}</Text>

      <Text style={styles.label}>Placas:</Text>
      <Text style={styles.value}>{result.placas}</Text>

      <Text style={styles.label}>Económico:</Text>
      <Text style={styles.value}>{result.economico}</Text>

      <Text style={styles.label}>Nombre:</Text>
      <Text style={styles.value}>{result.nombre}</Text>

      <Text style={styles.label}>Ruta:</Text>
      <Text style={styles.value}>{result.ruta}</Text>

      <Text style={styles.label}>Destino:</Text>
      <Text style={styles.value}>{result.destino}</Text>

      <Text style={styles.label}>ID Ruta:</Text>
      <Text style={styles.value}>{result.id_ruta}</Text>

      <Text style={styles.label}>Castigado:</Text>
      <Text style={styles.value}>{result.castigado === null ? 'No' : 'Sí'}</Text>
    </View>
  );
};

// Estilos
const styles = {
  label: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  value: {
    marginBottom: 10,
  },
};

export default ScanResult;
