import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
} from "react-native";

import { PlayerRole } from "../types/PlayerRole";
import {
  getGameRound,
  TOTAL_ROUNDS,
  PrototypeLanguage,
} from "../data/gameRounds";

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

  const roundData = getGameRound(
    currentRound,
    selectedLanguage as PrototypeLanguage
  );

  const phraseImage = roundData?.phraseImage;

  // --------------------------------------------------
  // IMAGE SHOWN AFTER THE READER FINISHES THE ROUND
  // --------------------------------------------------

  const getReaderResultPhraseImage = () => {
    switch (roundData?.id) {
      // Wat brand twee keer
      case "afrikaans001":
        return require("../assets/phrases/zulu/zulu-chilli.png");

      // Suid-Afrika se vlieende wekker
      case "afrikaans002":
        return require("../assets/phrases/zulu/zulu-hadeda.png");

      // Gooi my uit en wag vir 'n byt
      case "afrikaans003":
        return require("../assets/phrases/zulu/zulu-fishing.png");

      default:
        return phraseImage;
    }
  };

  const readerResultPhraseImage =
    getReaderResultPhraseImage();

  // --------------------------------------------------
  // CORRECT ILLUSTRATION
  // Used for the two decorative images
  // --------------------------------------------------

  const correctIllustration =
    roundData?.illustrations.find(
      (illustration) =>
        illustration.id ===
        roundData.correctIllustrationId
    );

  const [timeLeft, setTimeLeft] = useState(30);

  const timeoutSubmittedRef = useRef(false);

  const [isSubmittingGuess, setIsSubmittingGuess] =
    useState(false);

  const [isAdvancing, setIsAdvancing] =
    useState(false);

  const illustrationPositionStyles = [
    styles.illustration1,
    styles.illustration2,
    styles.illustration3,
    styles.illustration4,
    styles.illustration5,
    styles.illustration6,
    styles.illustration7,
    styles.illustration8,
    styles.illustration9,
  ];

  useEffect(() => {
    timeoutSubmittedRef.current = false;
  }, [roundStartedAt]);

  useEffect(() => {
    if (
      roundResult !== "playing" ||
      !roundStartedAt
    ) {
      return;
    }

    const updateTimer = () => {
      const elapsedSeconds = Math.floor(
        (Date.now() - roundStartedAt) / 1000
      );

      const remaining = Math.max(
        1000 - elapsedSeconds,
        0
      );

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

    const interval = setInterval(
      updateTimer,
      250
    );

    return () => clearInterval(interval);
  }, [
    roundStartedAt,
    roundResult,
    onTimeout,
    isGuesser,
  ]);

  // --------------------------------------------------
  // CORRECT RESULT
  // --------------------------------------------------

  if (roundResult === "correct") {
    return (
      <ImageBackground
        source={require("../assets/background/complete-background.png")}
        style={styles.completeBackground}
        resizeMode="stretch"
      >
        {isReader && correctIllustration?.image && (
          <>
            <Image
              source={correctIllustration.image}
              style={styles.decorImage1}
              resizeMode="contain"
            />

            <Image
              source={correctIllustration.image}
              style={styles.decorImage2}
              resizeMode="contain"
            />
          </>
        )}

        <View style={styles.completeContent}>
          {isReader ? (
            <>
              <Text style={styles.readerResultText}>
                This is what you said to your teammate
              </Text>

              {readerResultPhraseImage ? (
                <Image
                  source={readerResultPhraseImage}
                  style={styles.resultPhraseImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.phrase}>
                  {roundData?.phrase}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.role}>
                Correct!
              </Text>

              <Text style={styles.instruction}>
                Nice one — you got the right illustration.
              </Text>
            </>
          )}

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
            <Image
              source={require("../assets/buttons/next.png")}
              style={styles.nextButtonImage}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  // --------------------------------------------------
  // INCORRECT RESULT
  // --------------------------------------------------

  if (roundResult === "incorrect") {
    return (
      <ImageBackground
        source={require("../assets/background/complete-background.png")}
        style={styles.completeBackground}
        resizeMode="stretch"
      >
        {isReader && correctIllustration?.image && (
          <>
            <Image
              source={correctIllustration.image}
              style={styles.decorImage1}
              resizeMode="contain"
            />

            <Image
              source={correctIllustration.image}
              style={styles.decorImage2}
              resizeMode="contain"
            />
          </>
        )}

        <View style={styles.completeContent}>
          {isReader ? (
            <>
              <Text style={styles.readerResultText}>
                This is what you said to your teammate
              </Text>

              {readerResultPhraseImage ? (
                <Image
                  source={readerResultPhraseImage}
                  style={styles.resultPhraseImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.phrase}>
                  {roundData?.phrase}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.role}>
                Not quite!
              </Text>

              <Text style={styles.instruction}>
                That was the wrong illustration.
              </Text>

              <Text style={styles.correctAnswer}>
                Correct answer:{" "}
                {correctIllustration?.label}
              </Text>
            </>
          )}

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
            <Image
              source={require("../assets/buttons/next.png")}
              style={styles.nextButtonImage}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  // --------------------------------------------------
  // TIMEOUT RESULT
  // --------------------------------------------------

  if (roundResult === "timeout") {
    return (
      <ImageBackground
        source={require("../assets/background/complete-background.png")}
        style={styles.completeBackground}
        resizeMode="stretch"
      >
        {isReader && correctIllustration?.image && (
          <>
            <Image
              source={correctIllustration.image}
              style={styles.decorImage1}
              resizeMode="contain"
            />

            <Image
              source={correctIllustration.image}
              style={styles.decorImage2}
              resizeMode="contain"
            />
          </>
        )}

        <View style={styles.completeContent}>
          {isReader ? (
            <>
              <Text style={styles.readerResultText}>
                This is what you said to your teammate
              </Text>

              {readerResultPhraseImage ? (
                <Image
                  source={readerResultPhraseImage}
                  style={styles.resultPhraseImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.phrase}>
                  {roundData?.phrase}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.role}>
                Time&apos;s up!
              </Text>

              <Text style={styles.instruction}>
                No answer was selected in time.
              </Text>
            </>
          )}

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
            <Image
              source={require("../assets/buttons/next.png")}
              style={styles.nextButtonImage}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  // --------------------------------------------------
  // GUESSER / ILLUSTRATION GRID
  // --------------------------------------------------

  if (isGuesser) {
    return (
      <ImageBackground
        source={require("../assets/background/grid-background.png")}
        style={styles.gridBackground}
        resizeMode="stretch"
      >
        <View style={styles.gridContent}>
          <Text style={styles.timer}>
            {timeLeft}s
          </Text>

          <Text style={styles.round}>
            Round {currentRound}
          </Text>

          <View style={styles.illustrationGrid}>
            {roundData?.illustrations.map(
              (illustration, index) => (
                <Pressable
                  key={illustration.id}
                  style={[
                    styles.illustrationCard,
                    isSubmittingGuess &&
                      styles.disabledCard,
                  ]}
                  disabled={isSubmittingGuess}
                  onPress={async () => {
                    if (isSubmittingGuess) {
                      return;
                    }

                    setIsSubmittingGuess(true);

                    try {
                      await onGuess(
                        illustration.id
                      );
                    } finally {
                      setIsSubmittingGuess(
                        false
                      );
                    }
                  }}
                >
                  {illustration.image && (
                    <Image
                      source={illustration.image}
                      style={[
                        styles.illustrationImage,
                        illustrationPositionStyles[index],
                      ]}
                      resizeMode="contain"
                    />
                  )}
                </Pressable>
              )
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }

  // --------------------------------------------------
  // READER / PHRASE SCREEN
  // --------------------------------------------------

  if (isReader) {
    return (
      <ImageBackground
        source={require("../assets/background/reader-background.png")}
        style={styles.readerBackground}
        resizeMode="stretch"
      >
        <View style={styles.readerContent}>
          <Text style={styles.timer}>
            {timeLeft}s
          </Text>

          <Text style={styles.round}>
            Round {currentRound} / {TOTAL_ROUNDS}
          </Text>

          <View style={styles.readerInstructionContainer}>
            <Text style={styles.readerInstruction}>
              Read this phrase to your teammate. Try your
            </Text>

            <Text style={styles.readerInstruction}>
              best with pronunciation!
            </Text>
          </View>

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
        </View>
      </ImageBackground>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  gridBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  gridContent: {
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

  phraseImage: {
    width: 1500,
    height: 600,
    marginTop: 24,
  },

  illustrationGrid: {
    width: 1140,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 30,
    rowGap: 30,
    marginTop: 24,
  },

  illustrationCard: {
    width: 360,
    height: 360,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },

  illustrationImage: {
    width: 400,
    height: 400,
  },

  illustration1: {
    transform: [
      { translateX: -63 },
      { translateY: -55 },
    ],
  },

  illustration2: {
    transform: [
      { translateX: 3 },
      { translateY: -55 },
    ],
  },

  illustration3: {
    transform: [
      { translateX: 63 },
      { translateY: -55 },
    ],
  },

  illustration4: {
    transform: [
      { translateX: -63 },
      { translateY: 7 },
    ],
  },

  illustration5: {
    transform: [
      { translateX: 0 },
      { translateY: 7 },
    ],
  },

  illustration6: {
    transform: [
      { translateX: 63 },
      { translateY: 7 },
    ],
  },

  illustration7: {
    transform: [
      { translateX: -63 },
      { translateY: 67 },
    ],
  },

  illustration8: {
    transform: [
      { translateX: 0 },
      { translateY: 67 },
    ],
  },

  illustration9: {
    transform: [
      { translateX: 63 },
      { translateY: 67 },
    ],
  },

  illustrationText: {
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

  readerBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  readerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  readerInstructionContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  readerInstruction: {
    fontSize: 40,
    textAlign: "center",
    lineHeight: 54,
  },

  completeBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  completeContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    zIndex: 1,
  },

  readerResultText: {
    fontSize: 40,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },

  resultPhraseImage: {
    width: 1200,
    height: 600,
  },

  decorImage1: {
    position: "absolute",
    bottom: 300,
    left: 350,
    width: 380,
    height: 380,
    zIndex: 2,
    transform: [
      { rotate: "-20deg" },
    ],
  },

  decorImage2: {
    position: "absolute",
    top: 500,
    right: 230,
    width: 380,
    height: 380,
    zIndex: 2,
    transform: [
      { rotate: "-30deg" },
      { scaleX: -1 },
    ],
  },

  nextButton: {
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
  },

  nextButtonImage: {
    width: 820,
    height: 160,
  },
});