import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Image,
} from "react-native";

type EmailVoucherScreenProps = {
  onSend: (email: string) => Promise<void>;
  onCancel: () => void;
};

export default function EmailVoucherScreen({
  onSend,
}: EmailVoucherScreenProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedEmail = email.trim();

  const canSend =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  return (
    <ImageBackground
      source={require("../assets/background/champion.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/phrases/logo/email-voucher.png")}
          style={styles.emailVoucherImage}
          resizeMode="contain"
        />

        <Text style={styles.message}>
          Enter your email address and we’ll send your voucher there.
        </Text>

        <View style={styles.inputContainer}>
          <Image
            source={require("../components/input.png")}
            style={styles.inputImage}
            resizeMode="contain"
          />

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMessage("");
            }}
            placeholder="name@example.com"
            placeholderTextColor="#777"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {errorMessage !== "" && (
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>
        )}

        {canSend && (
          <Pressable
            style={styles.sendButton}
            disabled={isSending}
            onPress={async () => {
              if (isSending) return;

              setIsSending(true);
              setErrorMessage("");

              try {
                await onSend(trimmedEmail);
              } catch (error) {
                setErrorMessage(
                  "We couldn't send your voucher. Please check your email address and try again."
                );
              } finally {
                setIsSending(false);
              }
            }}
          >
            <Image
              source={require("../assets/buttons/send.png")}
              style={styles.sendImage}
              resizeMode="contain"
            />
          </Pressable>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  emailVoucherImage: {
    width: 1000,
    height: 350,
    marginTop: -190,
    marginBottom: 60,
  },

  message: {
    fontSize: 35,
    textAlign: "center",
    maxWidth: 700,
    marginBottom: 40,
  },

  inputContainer: {
    width: 900,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },

  inputImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  input: {
    position: "absolute",
    width: 720,
    height: 100,
    paddingHorizontal: 25,
    fontSize: 32,
    textAlign: "center",
    color: "#000",
    backgroundColor: "transparent",
    borderWidth: 0,
    outlineWidth: 0,
  },

  sendButton: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  sendImage: {
    width: 820,
    height: 160,
  },

  errorText: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 20,
    maxWidth: 700,
  },
});