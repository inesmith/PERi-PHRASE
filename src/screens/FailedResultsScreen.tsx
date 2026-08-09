import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { RoundHistoryItem } from "../types/GameSession";
import { gameRounds } from "../data/gameRounds";

type FailedResultsScreenProps = {
  correctRounds: number;
  totalRounds: number;
  roundHistory: RoundHistoryItem[];
  onDone: () => void;
};

export default function FailedResultsScreen({
  correctRounds,
  totalRounds,
  roundHistory,
  onDone,
}: FailedResultsScreenProps) {
  const missedRounds = roundHistory.filter(
    (item) => item.result !== "correct"
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Game Complete</Text>

      <Text style={styles.score}>
        {correctRounds} / {totalRounds} correct
      </Text>

      <Text style={styles.subtitle}>
        Here are the rounds you missed:
      </Text>

      {missedRounds.map((item, index) => {
        const roundData = gameRounds[item.roundNumber - 1];

        const correctIllustration =
          roundData?.illustrations.find(
            (illustration) =>
              illustration.id === roundData.correctIllustrationId
          );

        return (
          <View
            key={`${item.roundNumber}-${item.phraseId}-${index}`}
            style={styles.resultCard}
            >
            <Text style={styles.roundTitle}>
              Round {item.roundNumber}
            </Text>

            <Text style={styles.resultText}>
              Result:{" "}
              {item.result === "timeout"
                ? "Time ran out"
                : "Incorrect"}
            </Text>

            <Text style={styles.resultText}>
              Phrase: {roundData?.phrase}
            </Text>

            <Text style={styles.resultText}>
              Correct illustration: {correctIllustration?.label}
            </Text>
          </View>
        );
      })}

      <Pressable style={styles.button} onPress={onDone}>
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
  },

  score: {
    fontSize: 28,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 20,
    textAlign: "center",
  },

  resultCard: {
    width: "100%",
    maxWidth: 800,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },

  roundTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },

  resultText: {
    fontSize: 18,
  },

  button: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});