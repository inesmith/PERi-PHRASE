import { Pressable, StyleSheet, Text, View } from "react-native";
import { PlayerRole } from "../types/PlayerRole";

type OrderScreenProps = {
  orderNumber: string;
  receiptVerified: boolean;
  onVerifyReceipt: () => void;
};

export default function OrderScreen({
  orderNumber,
  receiptVerified,
  onVerifyReceipt,
}: OrderScreenProps) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peri-Phrase</Text>

      <Text style={styles.player}>
      </Text>

      <Text style={styles.label}>Calling order</Text>

      <Text style={styles.orderNumber}>#{orderNumber}</Text>

      {!receiptVerified ? (
        <Pressable style={styles.button} onPress={onVerifyReceipt}>
            <Text style={styles.buttonText}>Scan Receipt</Text>
        </Pressable>
        ) : (
        <Text style={styles.verified}>Receipt verified ✓</Text>
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

  player: {
    fontSize: 18,
  },

  label: {
    fontSize: 18,
    marginTop: 20,
  },

  orderNumber: {
    fontSize: 64,
    fontWeight: "bold",
  },

  verified: {
    fontSize: 20,
    fontWeight: "600",
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