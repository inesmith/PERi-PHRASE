import { Pressable, StyleSheet, Text, View } from "react-native";

type ResultsScreenProps = {
  correctRounds: number;
  totalRounds: number;
  onEmailVoucher: () => void;
  onPrintVoucher: () => void;
};

export default function ResultsScreen({
  correctRounds,
  totalRounds,
  onEmailVoucher,
  onPrintVoucher,
}: ResultsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congratulations!</Text>

      <Text style={styles.score}>
        {correctRounds} / {totalRounds}
      </Text>

      <Text style={styles.success}>
        Voucher Unlocked!
      </Text>

      <Text style={styles.message}>
        You got every round correct.
      </Text>

      <Text style={styles.rewardMessage}>
        Show your voucher at the order desk to collect your sticker pack.
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={onEmailVoucher}
        >
          <Text style={styles.buttonText}>
            Email Voucher
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={onPrintVoucher}
        >
          <Text style={styles.buttonText}>
            Print Voucher
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 18,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },

  score: {
    fontSize: 32,
    fontWeight: "bold",
  },

  success: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },

  message: {
    fontSize: 20,
    textAlign: "center",
  },

  rewardMessage: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 650,
    marginTop: 8,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },

  button: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 30,
    minWidth: 190,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});