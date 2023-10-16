import React, { useState } from "react";
import QRCode from "react-native-qrcode-svg";
import {
  StyleSheet,
  FlatList,
  Modal,
  View,
  Pressable,
  Text,
} from "react-native";

const data = [
  { id: 1, title: "Carlos Ruiz", description: "Crafter 2023, JHVB-45-K" },
  // { id: 2, title: "Elemento 2", description: "Descripción del elemento 2" },
  // Agrega más elementos aquí
];
export default function HomeChofer() {
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = () => {
    // Aquí puedes definir el valor del código QR, por ejemplo, una URL
    const qrValue = "http://awesome.link.qr";
    setShowQR(true);
  };

  // informacion del usuario
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const closeQRCode = () => {
    setShowQR(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => openModal(item)}>
            <Text>Información personal</Text>
          </Pressable>
        )}
      />

      {showQR ? (
        <>
         

          <QRCode value="http://awesome.link.qr" />
          <Pressable style={styles.button} onPress={closeQRCode}>
            <Text style={styles.buttonText}>Desactivar</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={styles.button} onPress={generateQRCode}>
          <Text style={styles.buttonText}>Activar</Text>
        </Pressable>
      )}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <View>
              {selectedItem && (
                <View>
                  <Text>{selectedItem.title}</Text>
                  <Text>{selectedItem.description}</Text>
                  <Pressable onPress={closeModal}>
                    <Text>Cerrar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  modalContent: {
    height: "25%",
    width: "100%",
    backgroundColor: "#25292e",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
});
