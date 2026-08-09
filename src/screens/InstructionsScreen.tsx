import { Pressable, StyleSheet, Text, View } from "react-native";

type InstructionsScreenProps = {
  hasStarted: boolean;
  onStart: () => void;
};

export default function InstructionsScreen({
  hasStarted,
  onStart,
}: InstructionsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to Play</Text>

      <Text style={styles.instruction}>
        1. Choose a language.
      </Text>

      <Text style={styles.instruction}>
        2. One player reads a phrase aloud.
      </Text>

      <Text style={styles.instruction}>
        3. The other player selects the matching illustration.
      </Text>

      <Text style={styles.instruction}>
        4. You have 30 seconds per round.
      </Text>

      {!hasStarted ? (
        <Pressable style={styles.button} onPress={onStart}>
            <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
        ) : (
        <Text style={styles.waiting}>
            Waiting for the other player...
        </Text>
        )}
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
    marginBottom: 12,
  },
  instruction: {
    fontSize: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  waiting: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
    },
});