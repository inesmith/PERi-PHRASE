import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect } from "react";

type FailedResultsScreenProps = {
  correctRounds: number;
  totalRounds: number;
  roundHistory: any[];
  onDone: () => void;
};

export default function FailedResultsScreen({
  onDone,
}: FailedResultsScreenProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onDone();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <ImageBackground
      source={require("../assets/background/complete-background.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          Eish... not quite PERi-fect!
        </Text>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            The heat got you this time —
          </Text>

          <Text style={styles.highlight}>
            no voucher unlocked.
          </Text>
        </View>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 90,
    fontFamily: "Nandos-Regular",
    textAlign: "center",
    marginBottom: 70,
  },

  messageContainer: {
    alignItems: "center",
  },

  message: {
    fontSize: 48,
    textAlign: "center",
    lineHeight: 60,
  },

  highlight: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#E32B3D",
    textAlign: "center",
    lineHeight: 60,
  },
});