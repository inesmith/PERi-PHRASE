import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";

import { PlayerRole } from "../types/PlayerRole";
import { gameRounds } from "../data/gameRounds";

type GameScreenProps = {
  playerRole: PlayerRole;
  reader: PlayerRole;
  guesser: PlayerRole;
  currentRound: number;
  onGuess: (illustrationId: string) => Promise<void>;
  roundResult: "playing" | "correct" | "incorrect" | "timeout";
  onNextRound: () => Promise<void>;
  roundStartedAt: number;
  onTimeout: () => void;
  selectedLanguage: string;
};

export default function GameScreen({
  playerRole,
  reader,
  guesser,
  currentRound,
  roundResult,
  roundStartedAt,
  onGuess,
  onNextRound,
  onTimeout,
  selectedLanguage,
}: GameScreenProps) {
  const isReader = playerRole === reader;
  const isGuesser = playerRole === guesser;

  const roundData = gameRounds[currentRound - 1];

  const phraseImage =
  roundData?.phraseImages?.[
    selectedLanguage as keyof typeof roundData.phraseImages
  ];

  const isFinalRound = currentRound === gameRounds.length;

  const resultButtonLabel = isFinalRound
    ? "View Results"
    : "Next Round";

  const [timeLeft, setTimeLeft] = useState(30);
  const timeoutSubmittedRef = useRef(false);
  const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);

  const [isAdvancing, setIsAdvancing] = useState(false);

  useEffect(() => {
    timeoutSubmittedRef.current = false;
  }, [roundStartedAt]);

  useEffect(() => {
    if (roundResult !== "playing" || !roundStartedAt) {
      return;
    }

    const updateTimer = () => {
        const elapsedSeconds = Math.floor(
            (Date.now() - roundStartedAt) / 1000
        );

        const remaining = Math.max(30 - elapsedSeconds, 0);

        setTimeLeft(remaining);

        if (
            remaining === 0 &&
            isGuesser &&
            !timeoutSubmittedRef.current
            ) {
            timeoutSubmittedRef.current = true;
            onTimeout();
        }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [roundStartedAt, roundResult, onTimeout]);

  if (roundResult === "correct") {
    return (
      <View style={styles.container}>
        <Text style={styles.role}>Correct!</Text>

        <Text style={styles.instruction}>
          Nice one — you got the right illustration.
        </Text>

        <Pressable
            style={[
                styles.nextButton,
                isAdvancing && styles.disabledCard,
            ]}
            disabled={isAdvancing}
            onPress={async () => {
                if (isAdvancing) return;

                setIsAdvancing(true);

                try {
                await onNextRound();
                } finally {
                setIsAdvancing(false);
                }
            }}
            >
          <Text style={styles.nextButtonText}>
            {resultButtonLabel}
          </Text>
        </Pressable>
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

        <Text style={styles.correctAnswer}>
            Correct answer:{" "}
            {roundData?.illustrations.find(
                (illustration) =>
                illustration.id === roundData.correctIllustrationId
            )?.label}
        </Text>

        <Pressable
            style={[
                styles.nextButton,
                isAdvancing && styles.disabledCard,
            ]}
            disabled={isAdvancing}
            onPress={async () => {
                if (isAdvancing) return;

                setIsAdvancing(true);

                try {
                await onNextRound();
                } finally {
                setIsAdvancing(false);
                }
            }}
            >
          <Text style={styles.nextButtonText}>
            {resultButtonLabel}
          </Text>
        </Pressable>
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

        <Pressable
        style={[
            styles.nextButton,
            isAdvancing && styles.disabledCard,
        ]}
        disabled={isAdvancing}
        onPress={async () => {
            if (isAdvancing) return;

            setIsAdvancing(true);

            try {
            await onNextRound();
            } finally {
            setIsAdvancing(false);
            }
        }}
        >
          <Text style={styles.nextButtonText}>
            {resultButtonLabel}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timeLeft}s</Text>

      <Text style={styles.round}>
        Round {currentRound}
      </Text>

      {isReader && (
        <>
          <Text style={styles.role}>
            You are the Reader
          </Text>

          <Text style={styles.instruction}>
            Read this phrase aloud:
          </Text>

          {phraseImage ? (
            <Image
                source={phraseImage}
                style={styles.phraseImage}
                resizeMode="contain"
            />
            ) : (
            <Text style={styles.phrase}>
                {roundData?.phrase}
            </Text>
          )}
        </>
      )}

      {isGuesser && (
        <>
          <Text style={styles.role}>
            You are the Guesser
          </Text>

          <Text style={styles.instruction}>
            Listen carefully and choose the correct illustration.
          </Text>

          <View style={styles.illustrationGrid}>
            {roundData?.illustrations.map((illustration) => (
              <Pressable
                key={illustration.id}
                style={[
                    styles.illustrationCard,
                    isSubmittingGuess && styles.disabledCard,
                ]}
                disabled={isSubmittingGuess}
                onPress={async () => {
                    if (isSubmittingGuess) return;

                    setIsSubmittingGuess(true);

                    try {
                    await onGuess(illustration.id);
                    } finally {
                    setIsSubmittingGuess(false);
                    }
                }}
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

  timer: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
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

  nextButton: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },

  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },

  correctAnswer: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },

  disabledCard: {
    opacity: 0.5,
  },

  phraseImage: {
    width: 500,
    height: 220,
    marginTop: 24,
  },
});