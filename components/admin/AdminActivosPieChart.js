import React, { useEffect, useState } from "react";
import { View, Dimensions, Text} from "react-native";
import { PieChart } from "react-native-chart-kit";
import io from "socket.io-client";
import scoketUrl from "../../api/urlSocket";

const COLORS = ["#006400", "#A9A9A9"];

const AdminActivosPieChart = () => {
  const [data, setData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const socket = io(scoketUrl);

    const fetchData = () => {
      socket.emit("client:graficaActivos");
    };

    const handleUpdate = () => {
      fetchData();
    };

    const handleResize = () => {
      const { width } = Dimensions.get("window");
      const mobileWidth = 768;
      setIsMobile(width <= mobileWidth);
    };

    fetchData();

    socket.on("server:updateActiva", handleUpdate);
    socket.on("server:graficaActivos", (jsonData) => {
      const newData = [
        {
          name: "TRABAJANDO ",
          value: jsonData[0].activo,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "TOTAL",
          value: jsonData[0].todas !== 0 ? jsonData[0].todas : 1,
          color: "#7F7F7F",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
      ];
      setData(newData);
    });

    handleResize();
    Dimensions.addEventListener("change", handleResize);

    return () => {
      socket.disconnect();
      // Dimensions.removeEventListener("change", handleResize);
      // Dimensions.removeEventListener("change", handleResize);

    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <PieChart
      data={data}
      width={Dimensions.get("window").width}
      height={200}
      chartConfig={{
        backgroundGradientFrom: "#1E2923",
        backgroundGradientTo: "#08130D",
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      }}
      accessor="value"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
      style={{ marginBottom: -20 }} // Ajusta el margen inferior para evitar superposición
    />
    {/* <View style={{ position: 'absolute', top: '50%' }}>
      <Text style={{ textAlign: 'center', color: '#7F7F7F' }}>
        UNIDADES TRABAJANDO: {data[0]?.value}
      </Text>
      <Text style={{ textAlign: 'center', color: '#7F7F7F' }}>
        TOTAL DE UNIDADES: {data[1]?.value}
      </Text>
    </View> */}
  </View>
  );
};

export default AdminActivosPieChart;
