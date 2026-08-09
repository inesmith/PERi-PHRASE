import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type EmailVoucherScreenProps = {
  onSend: (email: string) => void;
  onCancel: () => void;
};

export default function EmailVoucherScreen({
  onSend,
  onCancel,
}: EmailVoucherScreenProps) {
  const [email, setEmail] = useState("");

  const canSend = email.trim() !== "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Your Voucher</Text>

      <Text style={styles.message}>
        Enter your email address and we’ll send your voucher there.
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.button}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            !canSend && styles.disabledButton,
          ]}
          disabled={!canSend}
          onPress={() => onSend(email.trim())}
        >
          <Text style={styles.buttonText}>
            Send Voucher
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
    gap: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
  },

  message: {
    fontSize: 20,
    textAlign: "center",
    maxWidth: 600,
  },

  input: {
    width: "100%",
    maxWidth: 520,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 16,
  },

  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },

  disabledButton: {
    opacity: 0.4,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});