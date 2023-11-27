import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import io from "socket.io-client";
import scoketUrl from "../../api/urlSocket";

const socket = io(scoketUrl);

const AdminChartCastigados = () => {
  const [user, setUser] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.emit("client:graficaCastigos");

    socket.on("server:graficaCastigos", (data) => {
      setUser(data);
    });

    return () => {
      socket.off("client:graficaCastigos");
      socket.off("server:graficaCastigos");
    };
  }, []);

  useEffect(() => {
    const newData = user.map((result) => {
      const diaSemana = result.dia_semana;
      const time = `${diaSemana}`;
      const amount = result.conductores_castigados;
      return { time, amount };
    });

    setData(newData);
  }, [user]);

  const chartConfig = {
    backgroundGradientFromOpacity: 0.7,
    backgroundGradientToOpacity: 0.7,
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    barPercentage: 1,
    decimalPlaces: 1,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View>
      <Text>Estadistica de los castigados semanal</Text>
      <BarChart
        data={{
          labels: data.map((item) => item.time),
          datasets: [
            {
              data: data.map((item) => item.amount),
            },
          ],
        }}
        width={300}
        height={200}
        yAxisLabel=""
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        withInnerLines={false}
        withHorizontalLabels={false}
        withVerticalLabels={false}
      />
      {/* Use custom components for XAxis and YAxis */}
      <View>
        {data.map((item, index) => (
          <Text key={index} style={{ marginLeft: 10, color: "red" }}>
            {item.time}
          </Text>
        ))}
      </View>
      <View style={{ marginLeft: 10 }}>
        {data.map((item, index) => (
          <Text key={index} style={{ color: "black" }}>
            {item.amount}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default AdminChartCastigados;
