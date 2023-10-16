import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Login from './components/auth/Login';
import SignIn from './components/auth/SignIn';
import HomeChofer from './components/chofer/Home';
import HomeChecador from './components/checador/Home';

export default function App() {
  return (
    <View style={styles.container}>
      <HomeChecador></HomeChecador>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
