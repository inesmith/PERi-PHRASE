import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

type InstructionsScreenProps = {
  onStart: () => void;
};

export default function InstructionsScreen({
  onStart,
}: InstructionsScreenProps) {
  return (
    <ImageBackground
      source={require("../assets/background/instructions-background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/phrases/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Instructions:
        </Text>

        <Text
          style={[
            styles.instruction,
            styles.instruction1,
          ]}
        >
          Choose the South African language that you speak.
        </Text>

        <Text
          style={[
            styles.instruction,
            styles.instruction2,
          ]}
        >
          Read the phrase that appears out loud.
        </Text>

        <Text
          style={[
            styles.instruction,
            styles.instruction3,
          ]}
        >
          Your partner must choose the corresponding picture on their screen.
        </Text>

        <Text
          style={[
            styles.instruction,
            styles.instruction4,
          ]}
        >
          Once the correct picture is chosen, the game will automatically swap your screens.
        </Text>

        <Pressable
          style={styles.continueButton}
          onPress={onStart}
        >
          <Image
            source={require("../assets/buttons/continue.png")}
            style={styles.continueImage}
            resizeMode="contain"
          />
        </Pressable>
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
  },

  logo: {
    position: "absolute",
    top: 0,
    width: "35%",
    height: "35%",
    transform: [{ rotate: "-3deg" }],
  },

  title: {
    position: "absolute",
    top: 510,
    fontSize: 96,
    fontWeight: "bold",
    fontFamily: "Nandos-Regular",
    marginLeft: -520,
  },

  instruction: {
    position: "absolute",
    width: 1500,
    fontSize: 40,
    fontWeight: "400",
    textAlign: "left",
    marginLeft: 300,
    marginTop: 5,
  },

  instruction1: {
    top: 700,
  },

  instruction2: {
    top: 805,
  },

  instruction3: {
    top: 920,
  },

  instruction4: {
    top: 1045,
  },

  continueButton: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
  },

  continueImage: {
    width: 820,
    height: 160,
    marginBottom: 100,
  },
});