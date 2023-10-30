// import * as React from 'react';
// import { Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const Tab = createBottomTabNavigator();

// function Castigos() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Castigos!</Text>
//     </View>
//   );
// }

// function MyTabs() {
//   return (
//     <Tab.Navigator>

//       <Tab.Screen name="Inicio-chofer" component={HomeChofer} />
//       <Tab.Screen name="Inicio-checador" component={HomeChecador} />
//       <Tab.Screen name="Castigos" component={Castigos} />

//     </Tab.Navigator>
//   );
// }

// export default function App() {
//   return (
//     // <NavigationContainer>
//     //   <MyTabs />
//     // </NavigationContainer>
//     <>
//     <Login></Login>
//     </>
//   );
// }

import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./components/SplashScreen";
const Stack = createNativeStackNavigator();

//screens
import Login from "./components/auth/Login";
import SignIn from "./components/auth/SignIn";
import Inicio from "./components/Inicio";
export default function App() {
  return (
    <NavigationContainer 
    >
      <Stack.Navigator style={{ transform: [{ scale: 2 }, { rotate: '15deg' }] }} initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}  />

        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="Inicio" 
          options={{
          //   title: 'My home',
          //   headerStyle: {
          //     backgroundColor: '#f4511e',
          //   },
          //   headerTintColor: '#fff',
            headerShown: false
          }}
           component={Inicio} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
