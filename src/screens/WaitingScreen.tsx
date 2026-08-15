import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
} from "react-native";

export default function WaitingScreen() {
  return (
    <ImageBackground
      source={require("../assets/background/OrderScreen.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/phrases/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Waiting for the 
          </Text>

          <Text style={[styles.instructionText, styles.highlightText]}>
            second player...
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
    padding: 24,
  },

  logo: {
    position: "absolute",
    top: 390,
    width: 850,
    height: 438,
    transform: [{ rotate: "-3deg" }],
  },

  instructionContainer: {
    position: "absolute",
    top: 875,
    alignItems: "center",
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
});