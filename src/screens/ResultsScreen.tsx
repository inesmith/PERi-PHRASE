import { Pressable, StyleSheet, Text, View } from "react-native";

type ResultsScreenProps = {
  correctRounds: number;
  totalRounds: number;
};

export default function ResultsScreen({
  correctRounds,
  totalRounds,
}: ResultsScreenProps) {
  const voucherUnlocked = correctRounds === totalRounds;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Complete!</Text>

      <Text style={styles.score}>
        You got {correctRounds} out of {totalRounds} rounds correct.
      </Text>

      {voucherUnlocked ? (
        <>
          <Text style={styles.success}>
            Voucher unlocked!
          </Text>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Email Voucher</Text>
          </Pressable>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Print Voucher</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.message}>
          You need all rounds correct to unlock the voucher.
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
  },

  score: {
    fontSize: 22,
    textAlign: "center",
  },

  success: {
    fontSize: 24,
    fontWeight: "600",
  },

  message: {
    fontSize: 20,
    textAlign: "center",
  },

  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});