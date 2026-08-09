import { StyleSheet, Text, View } from "react-native";

export default function WaitingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peri-Phrase</Text>
      <Text style={styles.message}>Waiting for the other player...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  message: {
    fontSize: 20,
  },
});