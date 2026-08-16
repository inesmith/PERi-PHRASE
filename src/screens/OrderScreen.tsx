import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
} from "react-native";
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
  <ImageBackground
    source={require("../assets/background/OrderScreen.png")}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.container}>

      <Text style={styles.readyText}>Are you ready to</Text>

      <Image
        source={require("../assets/phrases/logo/logo2.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Grab a teammate and{" "}
          <Text style={styles.highlightText}>scan</Text>
        </Text>

        <Text style={styles.instructionText}>
          <Text style={styles.highlightText}>the QR code</Text>
          {" "}on your receipt.
        </Text>
      </View>

      {!receiptVerified ? (
        <Pressable
          style={styles.scanButton}
          onPress={onVerifyReceipt}
        >
          <Image
            source={require("../assets/buttons/scan.png")}
            style={styles.scanImage}
            resizeMode="contain"
          />
        </Pressable>
      ) : (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>
            Waiting for the other player...
          </Text>
        </View>
      )}
        </View>
    </ImageBackground>
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

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
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

  waitingContainer: {
    position: "absolute",
    bottom: 300,
    alignItems: "center",
  },

  waitingText: {
    fontSize: 35,
    textAlign: "center",
    lineHeight: 58,
  },

  waitingHighlight: {
    color: "#E32B3D",
    fontWeight: "bold",
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

  readyText: {
    fontSize: 150,
    fontFamily: "Nandos-Regular",
    textAlign: "center",
    marginTop: -355,
  },

  logo: {
    top: -135,
    alignSelf: "center",
    width: 850,
    height: 438,
    transform: [{ rotate: "-3deg" }],
  },

  instructionContainer: {
    alignItems: "center",
    marginTop: -100,
  },

  instructionText: {
    fontSize: 48,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 58,
  },

  highlightText: {
    color: "#E32B3D",
    fontWeight: "bold",
  },

  scanButton: {
    position: "absolute",
    bottom: 300,
    alignSelf: "center",
  },

  scanImage: {
    width: 700,
    height: 180,
  },
});