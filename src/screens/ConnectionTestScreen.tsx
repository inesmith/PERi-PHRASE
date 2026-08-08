import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GameSession } from "../types/GameSession";
import {
  subscribeToGameSession,
  updateGameSession,
} from "../services/gameSessionService";

export default function ConnectionTestScreen() {
  const [session, setSession] = useState<GameSession | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToGameSession(setSession);

    return unsubscribe;
  }, []);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Connecting to Peri-Phrase session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peri-Phrase Connection Test</Text>

      <Text>
        Player 1: {session.player1Connected ? "Connected" : "Not connected"}
      </Text>

      <Text>
        Player 2: {session.player2Connected ? "Connected" : "Not connected"}
      </Text>

      <Pressable
        style={styles.button}
        onPress={() =>
          updateGameSession({
            player1Connected: !session.player1Connected,
          })
        }
      >
        <Text>Toggle Player 1</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() =>
          updateGameSession({
            player2Connected: !session.player2Connected,
          })
        }
      >
        <Text>Toggle Player 2</Text>
      </Pressable>
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});