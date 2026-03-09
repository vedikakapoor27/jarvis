import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

export default function VoiceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>◎ VOICE MODULE</Text>
      <Text style={styles.sub}>Coming next...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, letterSpacing: 4, color: Colors.arc },
  sub: { fontSize: 10, letterSpacing: 2, color: Colors.arcDim, marginTop: 8 },
});