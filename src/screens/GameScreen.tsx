import { StyleSheet, Text, View, Pressable } from "react-native";
import { PlayerRole } from "../types/PlayerRole";
import { gameRounds } from "../data/gameRounds";

type GameScreenProps = {
  playerRole: PlayerRole;
  reader: PlayerRole;
  guesser: PlayerRole;
  currentRound: number;
  onGuess: (illustrationId: string) => void;
  roundResult: "playing" | "correct" | "incorrect" | "timeout";
};

export default function GameScreen({
  playerRole,
  reader,
  guesser,
  currentRound,
  roundResult,
  onGuess,
}: GameScreenProps) {
  const isReader = playerRole === reader;
  const isGuesser = playerRole === guesser;
  const roundData = gameRounds[currentRound - 1];

  if (roundResult === "correct") {
  return (
    <View style={styles.container}>
      <Text style={styles.role}>Correct!</Text>

      <Text style={styles.instruction}>
        Nice one — you got the right illustration.
      </Text>
    </View>
  );
}

if (roundResult === "incorrect") {
  return (
    <View style={styles.container}>
      <Text style={styles.role}>Not quite!</Text>

      <Text style={styles.instruction}>
        That was the wrong illustration.
      </Text>
    </View>
  );
}

if (roundResult === "timeout") {
  return (
    <View style={styles.container}>
      <Text style={styles.role}>Time's up!</Text>

      <Text style={styles.instruction}>
        No answer was selected in time.
      </Text>
    </View>
  );
}

  return (
    <View style={styles.container}>
      <Text style={styles.round}>Round {currentRound}</Text>

      {isReader && (
        <>
            <Text style={styles.role}>You are the Reader</Text>

            <Text style={styles.instruction}>
            Read this phrase aloud:
            </Text>

            <Text style={styles.phrase}>
            {roundData?.phrase}
            </Text>
        </>
      )}

      {isGuesser && (
        <>
            <Text style={styles.role}>You are the Guesser</Text>

            <Text style={styles.instruction}>
            Listen carefully and choose the correct illustration.
            </Text>

            <View style={styles.illustrationGrid}>
            {roundData?.illustrations.map((illustration) => (
                <Pressable
                    key={illustration.id}
                    style={styles.illustrationCard}
                    onPress={() => onGuess(illustration.id)}
                    >
                    <Text style={styles.illustrationText}>
                        {illustration.label}
                    </Text>
                </Pressable>
            ))}
            </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  round: {
    fontSize: 24,
    marginBottom: 24,
  },

  role: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },

  instruction: {
    fontSize: 20,
    textAlign: "center",
  },

  phrase: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 24,
  },

  illustrationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
    maxWidth: 800,
  },

  illustrationCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
    minWidth: 180,
    alignItems: "center",
  },

  illustrationText: {
    fontSize: 18,
    fontWeight: "600",
  },
});