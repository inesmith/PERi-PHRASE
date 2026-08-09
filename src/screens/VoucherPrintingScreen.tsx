import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

type VoucherPrintingScreenProps = {
  onComplete: () => void;
};

export default function VoucherPrintingScreen({
  onComplete,
}: VoucherPrintingScreenProps) {
  const voucherPosition = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.timing(voucherPosition, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        onComplete();
      }, 500);
    });
  }, [onComplete, voucherPosition]);

  const translateY =
    voucherPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [-80, 70],
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Printing Your Voucher...
      </Text>

      <View style={styles.printer}>
        <View style={styles.printerTop} />

        <View style={styles.slot} />

        <Animated.View
          style={[
            styles.voucher,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.voucherTitle}>
            PERi-PHRASE
          </Text>

          <Text style={styles.voucherText}>
            Voucher Unlocked!
          </Text>

          <Text style={styles.voucherText}>
            6 / 6
          </Text>
        </Animated.View>
      </View>

      <Text style={styles.message}>
        Please wait while your voucher prints.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },

  printer: {
    width: 340,
    height: 260,
    alignItems: "center",
    overflow: "hidden",
  },

  printerTop: {
    width: 280,
    height: 120,
    borderWidth: 3,
    borderRadius: 16,
  },

  slot: {
    width: 180,
    height: 10,
    borderWidth: 2,
    marginTop: -28,
    zIndex: 2,
  },

  voucher: {
    width: 200,
    height: 130,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  voucherTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  voucherText: {
    fontSize: 17,
    fontWeight: "600",
  },

  message: {
    fontSize: 20,
    textAlign: "center",
  },
});