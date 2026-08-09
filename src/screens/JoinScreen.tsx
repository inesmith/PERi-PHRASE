import { Pressable, StyleSheet, Text, View } from "react-native";
import { PlayerRole } from "../types/PlayerRole";

type JoinScreenProps = {
  onJoin: (role: PlayerRole) => void;
};

export default function JoinScreen({ onJoin }: JoinScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peri-Phrase</Text>
      <Text style={styles.subtitle}>Choose your player role</Text>

      <Pressable style={styles.button} onPress={() => onJoin("player1")}>
        <Text>Join as Player 1</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => onJoin("player2")}>
        <Text>Join as Player 2</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
});