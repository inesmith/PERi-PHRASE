import { Pressable, StyleSheet, Text, View } from "react-native";

type VoucherSentScreenProps = {
  onDone: () => void;
};

export default function VoucherSentScreen({
  onDone,
}: VoucherSentScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voucher Sent!</Text>

      <Text style={styles.message}>
        Check your inbox for your voucher.
      </Text>

      <Text style={styles.message}>
        Show your voucher at the order desk to collect your sticker pack.
      </Text>

      <Pressable style={styles.button} onPress={onDone}>
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 20,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },

  message: {
    fontSize: 20,
    textAlign: "center",
    maxWidth: 650,
  },

  button: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});