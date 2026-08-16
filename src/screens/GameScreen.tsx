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
  // READER PHRASE IMAGE
  // --------------------------------------------------

  const getReaderPhraseImage = () => {
    switch (roundData?.id) {
      case "isizulu001":
        return require("../assets/phrases/zulu/zulu-vuvuzela.png");

      case "isizulu002":
        return require("../assets/phrases/zulu/Full-Taxi.png");

      case "isizulu003":
        return require("../assets/phrases/zulu/zulu-buckethat.png");

      default:
        return phraseImage;
    }
  };

  const readerPhraseImage = getReaderPhraseImage();

  // --------------------------------------------------
  // IMAGE SHOWN AFTER THE READER FINISHES THE ROUND
  // --------------------------------------------------

  const getReaderResultPhraseImage = () => {
    switch (roundData?.id) {
      // -----------------------------------------------
      // AFRIKAANS READER -> ZULU RESULT
      // -----------------------------------------------

      case "afrikaans001":
        return require("../assets/phrases/english/what-burns-twice.png");

      case "afrikaans002":
        return require("../assets/phrases/english/alarm-clock.png");

      case "afrikaans003":
        return require("../assets/phrases/english/throuw-out.png");

      // -----------------------------------------------
      // ZULU READER -> AFRIKAANS RESULT
      // -----------------------------------------------

      case "isizulu001":
        return require("../assets/phrases/english/no-mouth.png");

      case "isizulu002":
        return require("../assets/phrases/english/more-space.png");

      case "isizulu003":
        return require("../assets/phrases/english/style-dont-stop.png");

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
        30 - elapsedSeconds,
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
              <Text style={styles.guesserResultTitle}>
                PERi-FECT!
              </Text>

              {correctIllustration?.image && (
                <Image
                  source={correctIllustration.image}
                  style={styles.guesserCorrectImage}
                  resizeMode="contain"
                />
              )}

              <Text style={styles.phrase}>
                {roundData?.phrase}
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
              <Text style={styles.guesserResultTitle}>
                Eish, the flavour was off!
              </Text>

              {correctIllustration?.image && (
                <Image
                  source={correctIllustration.image}
                  style={styles.guesserCorrectImage}
                  resizeMode="contain"
                />
              )}

              <Text style={styles.phrase}>
                {roundData?.phrase}
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
              <Text style={styles.guesserResultTitle}>
                Ooo, things got a little too spicy!
              </Text>

              {correctIllustration?.image && (
                <Image
                  source={correctIllustration.image}
                  style={styles.guesserCorrectImage}
                  resizeMode="contain"
                />
              )}

              <Text style={styles.phrase}>
                {roundData?.phrase}
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
          <Text style={[styles.timer, styles.gridTimer]}>
            {timeLeft}s
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
              Read this phrase out loud
            </Text>

            <Text style={styles.readerInstruction}>
              as best you can!
            </Text>
          </View>

          {readerPhraseImage ? (
            <Image
              source={readerPhraseImage}
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
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 16,
  },

  round: {
    fontSize: 35,
    marginBottom: 24,
    color: "#E32B3D",
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
    fontSize: 50,
    textAlign: "center",
    marginTop: 24,
  },

  phraseImage: {
    width: 1250,
    height: 500,
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
      { translateY: -5 },
    ],
  },

  illustration2: {
    transform: [
      { translateX: 3 },
      { translateY: -5 },
    ],
  },

  illustration3: {
    transform: [
      { translateX: 63 },
      { translateY: -5 },
    ],
  },

  illustration4: {
    transform: [
      { translateX: -63 },
      { translateY: 58 },
    ],
  },

  illustration5: {
    transform: [
      { translateX: 0 },
      { translateY: 58 },
    ],
  },

  illustration6: {
    transform: [
      { translateX: 63 },
      { translateY: 58 },
    ],
  },

  illustration7: {
    transform: [
      { translateX: -63 },
      { translateY: 118 },
    ],
  },

  illustration8: {
    transform: [
      { translateX: 0 },
      { translateY: 118 },
    ],
  },

  illustration9: {
    transform: [
      { translateX: 63 },
      { translateY: 118 },
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

  guesserResultTitle: {
    fontSize: 80,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Nandos-Regular",
  },

  guesserResultLabel: {
    fontSize: 40,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 10,
  },

  guesserPhraseImage: {
    width: 900,
    height: 300,
  },

  guesserCorrectImage: {
    width: 360,
    height: 360,
  },

  gridTimer: {
    position: "absolute",
    top: 45,
    alignSelf: "center",
  },
});