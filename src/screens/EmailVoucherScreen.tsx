import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type EmailVoucherScreenProps = {
  onSend: (email: string) => Promise<void>;
  onCancel: () => void;
};

export default function EmailVoucherScreen({
  onSend,
  onCancel,
}: EmailVoucherScreenProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

      {errorMessage !== "" && (
        <Text style={styles.errorText}>
            {errorMessage}
        </Text>
      )}

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
                (!canSend || isSending) && styles.disabledButton,
            ]}
            disabled={!canSend || isSending}
            onPress={async () => {
                if (isSending) return;

                setIsSending(true);

                setIsSending(true);
                setErrorMessage("");

                try {
                await onSend(email.trim());
                } catch (error) {
                setErrorMessage(
                    "We couldn't send your voucher. Please check your email address and try again."
                );
                } finally {
                setIsSending(false);
                }
            }}
            >
            <Text style={styles.buttonText}>
                {isSending ? "Sending..." : "Send Voucher"}
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

  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
  },
});