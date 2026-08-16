import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
} from "react-native";

type VoucherSentScreenProps = {
  onDone: () => void;
};

export default function VoucherSentScreen({
  onDone,
}: VoucherSentScreenProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onDone();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <ImageBackground
      source={require("../assets/background/voucher-background.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/phrases/logo/voucher-sent.png")}
          style={styles.voucherSentImage}
          resizeMode="contain"
        />
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
    gap: 20,
  },

  voucherSentImage: {
    width: 1000,
    height: 350,
    marginBottom: 40,
  },

  message: {
    fontSize: 35,
    textAlign: "center",
    maxWidth: 800,
  },
});