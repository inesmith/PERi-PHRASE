import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";

type ResultsScreenProps = {
  correctRounds: number;
  totalRounds: number;
  onEmailVoucher: () => void | Promise<void>;
};

export default function ResultsScreen({
  onEmailVoucher,
}: ResultsScreenProps) {
  const [isOpeningReward, setIsOpeningReward] = useState(false);

  const handleRewardPress = async () => {
    if (isOpeningReward) return;

    setIsOpeningReward(true);

    // Give React Native time to visibly show
    // the opacity change before changing screens.
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      await onEmailVoucher();
    } finally {
      setIsOpeningReward(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background/champion.png")}
      style={styles.background}
      resizeMode="stretch"
    >
      <Image
        source={require("../assets/phrases/logo/champion.png")}
        style={styles.topImage}
        resizeMode="contain"
      />

      <Pressable
        style={[
          styles.emailButton,
          isOpeningReward && styles.disabledButton,
        ]}
        disabled={isOpeningReward}
        onPress={handleRewardPress}
      >
        <Image
          source={require("../assets/buttons/reward.png")}
          style={styles.emailButtonImage}
          resizeMode="contain"
        />
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  topImage: {
    position: "absolute",
    top: 200,
    alignSelf: "center",
    width: 1300,
    height: 700,
    zIndex: 2,
  },

  emailButton: {
    position: "absolute",
    bottom: 180,
    alignSelf: "center",
  },

  emailButtonImage: {
    width: 819,
    height: 255,
    marginBottom: 200,
  },

  disabledButton: {
    opacity: 0.5,
  },
});