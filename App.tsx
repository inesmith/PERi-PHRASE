import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendVoucherEmail } from "./src/services/voucherService";
import { TOTAL_ROUNDS } from "./src/data/gameRounds";

import OrderScreen from "./src/screens/OrderScreen";
import InstructionsScreen from "./src/screens/InstructionsScreen";
import LanguageSelectionScreen from "./src/screens/LanguageSelectionScreen";
import GameScreen from "./src/screens/GameScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import FailedResultsScreen from "./src/screens/FailedResultsScreen";
import EmailVoucherScreen from "./src/screens/EmailVoucherScreen";
import VoucherSentScreen from "./src/screens/VoucherSentScreen";
import VoucherPrintedScreen from "./src/screens/VoucherPrintedScreen";
import VoucherPrintingScreen from "./src/screens/VoucherPrintingScreen";

import { PlayerRole } from "./src/types/PlayerRole";
import { GameSession } from "./src/types/GameSession";

import {
  subscribeToGameSession,
  updateGameSession,
  startPlayer,
  claimPlayerRole,
  claimScreenSlot,
  initializeGameRound,
  confirmPlayerLanguage,
  submitGuess,
  advanceToNextRound,
  submitTimeout,
  resetGameSession,
} from "./src/services/gameSessionService";

type ScreenSlot = "screen1" | "screen2";

export default function App() {
  const [playerRole, setPlayerRole] =
    useState<PlayerRole | null>(null);

  const [session, setSession] =
    useState<GameSession | null>(null);

  const [screenSlot, setScreenSlot] =
    useState<ScreenSlot | null>(null);

  const [voucherView, setVoucherView] = useState<
    "options" | "email" | "sent" | "printing" | "printed"
  >("options");

  const totalRounds = TOTAL_ROUNDS;

  // --------------------------------------------------
  // LIVE FIRESTORE SESSION
  // --------------------------------------------------

  useEffect(() => {
    const unsubscribe =
      subscribeToGameSession(setSession);

    return unsubscribe;
  }, []);

  // --------------------------------------------------
  // PERMANENT SCREEN IDENTITY
  // --------------------------------------------------

  useEffect(() => {
    const assignScreen = async () => {
      const savedSlot =
        await AsyncStorage.getItem("screenSlot");

      if (
        savedSlot === "screen1" ||
        savedSlot === "screen2"
      ) {
        setScreenSlot(savedSlot);
        return;
      }

      const slot = await claimScreenSlot();

      if (slot) {
        await AsyncStorage.setItem(
          "screenSlot",
          slot
        );

        setScreenSlot(slot);
      }
    };

    assignScreen();
  }, []);

  // --------------------------------------------------
  // RESTORE PLAYER ROLE AFTER EXPO REFRESH
  // --------------------------------------------------

  useEffect(() => {
    const loadPlayerRole = async () => {
      const savedRole =
        await AsyncStorage.getItem("playerRole");

      if (
        savedRole === "player1" ||
        savedRole === "player2"
      ) {
        setPlayerRole(savedRole);
      }
    };

    loadPlayerRole();
  }, []);

  // --------------------------------------------------
  // INITIALIZE GAME AFTER BOTH LANGUAGES ARE CHOSEN
  // --------------------------------------------------

  useEffect(() => {
    const startGame = async () => {
      if (!session || !playerRole) {
        return;
      }

      const shouldInitializeGame =
        session.player1Started &&
        session.player2Started &&
        session.player1Language !== "" &&
        session.player2Language !== "" &&
        !session.gameStarted &&
        session.firstStarter === playerRole;

      if (shouldInitializeGame) {
        await initializeGameRound();
      }
    };

    startGame();
  }, [session, playerRole]);
  

  // --------------------------------------------------
  // CLEAR OLD PLAYER ROLE FOR A FRESH GAME
  // --------------------------------------------------

  useEffect(() => {
    const resetSavedPlayerRole = async () => {
      if (!session) {
        return;
      }

      const sessionIsFresh =
        !session.player1Connected &&
        !session.player2Connected &&
        !session.player1ReceiptVerified &&
        !session.player2ReceiptVerified &&
        !session.player1Started &&
        !session.player2Started &&
        !session.gameStarted;

      if (sessionIsFresh) {
        await AsyncStorage.removeItem(
          "playerRole"
        );

        setPlayerRole(null);
        setVoucherView("options");
      }
    };

    resetSavedPlayerRole();
  }, [session]);

  // --------------------------------------------------
  // WAIT UNTIL FIRESTORE + SCREEN SLOT ARE READY
  // --------------------------------------------------

  if (!session || !screenSlot) {
    return null;
  }

  // --------------------------------------------------
  // ORDER INFORMATION
  // --------------------------------------------------

  const orderNumber =
    screenSlot === "screen1"
      ? session.screen1OrderNumber
      : session.screen2OrderNumber;

  // --------------------------------------------------
  // RECEIPT INFORMATION
  // --------------------------------------------------

  const receiptVerified =
    playerRole === "player1"
      ? session.player1ReceiptVerified
      : playerRole === "player2"
        ? session.player2ReceiptVerified
        : false;

  const bothReceiptsVerified =
    session.player1ReceiptVerified &&
    session.player2ReceiptVerified;

  // --------------------------------------------------
  // START INFORMATION
  // --------------------------------------------------

  const hasStarted =
    playerRole === "player1"
      ? session.player1Started
      : playerRole === "player2"
        ? session.player2Started
        : false;

  const bothPlayersStarted =
    session.player1Started &&
    session.player2Started;

  // --------------------------------------------------
  // LANGUAGE INFORMATION
  // --------------------------------------------------

  const selectedLanguage =
    playerRole === "player1"
      ? session.player1Language
      : playerRole === "player2"
        ? session.player2Language
        : "";

  const unavailableLanguage =
    playerRole === "player1"
      ? session.player2Language
      : playerRole === "player2"
        ? session.player1Language
        : "";

  const guesserLanguage =
    session.guesser === "player1"
      ? session.player1Language
      : session.player2Language;

  const otherPlayerHasSelected =
  playerRole === "player1"
    ? session.player2Language !== ""
    : playerRole === "player2"
      ? session.player1Language !== ""
      : false;

  // --------------------------------------------------
  // RECEIPT SCAN
  // --------------------------------------------------

  const handleVerifyReceipt = async () => {
    if (playerRole) {
      return;
    }

    // First scanner = Player 1
    // Second scanner = Player 2
    const claimedRole =
      await claimPlayerRole();

    if (!claimedRole) {
      return;
    }

    setPlayerRole(claimedRole);

    await AsyncStorage.setItem(
      "playerRole",
      claimedRole
    );

    if (claimedRole === "player1") {
      await updateGameSession({
        player1ReceiptVerified: true,
      });
    } else {
      await updateGameSession({
        player2ReceiptVerified: true,
      });
    }
  };

  // --------------------------------------------------
  // START FROM INSTRUCTIONS
  // --------------------------------------------------

  const handleStart = async () => {
    if (!playerRole) {
      return;
    }

    await startPlayer(playerRole);
  };

  // --------------------------------------------------
  // LANGUAGE CONFIRMATION
  // --------------------------------------------------

  const handleSelectLanguage = async (
    language: string
  ) => {
    if (!playerRole) {
      return;
    }

    const success =
      await confirmPlayerLanguage(
        playerRole,
        language
      );

    if (!success) {
      console.log(
        "That language was already taken."
      );
    }
  };

  // --------------------------------------------------
  // GAMEPLAY
  // --------------------------------------------------

  const handleGuess = async (
    illustrationId: string
  ) => {
    const result =
      await submitGuess(illustrationId);

    console.log("Guess result:", result);
  };

  const handleNextRound = async () => {
    await advanceToNextRound();
  };

  const handleTimeout = async () => {
    await submitTimeout();
  };

  // --------------------------------------------------
  // RESET FOR NEXT CUSTOMERS
  // --------------------------------------------------

  const handleResetGame = async () => {
    await resetGameSession();

    // Remove only the customer's temporary identity.
    // Keep screenSlot so each physical screen remembers
    // whether it is screen1 or screen2.
    await AsyncStorage.removeItem(
      "playerRole"
    );

    setPlayerRole(null);
    setVoucherView("options");
  };

  // --------------------------------------------------
  // FAILED GAME RESULTS
  // --------------------------------------------------

  if (
    session.gameFinished &&
    session.correctRounds < totalRounds
  ) {
    return (
      <FailedResultsScreen
        correctRounds={
          session.correctRounds
        }
        totalRounds={totalRounds}
        roundHistory={
          session.roundHistory
        }
        onDone={handleResetGame}
      />
    );
  }

  // --------------------------------------------------
  // VOUCHER SENT CONFIRMATION
  // --------------------------------------------------

  if (
    session.gameFinished &&
    session.correctRounds === totalRounds &&
    voucherView === "sent"
  ) {
    return (
      <VoucherSentScreen
        onDone={handleResetGame}
      />
    );
  }

  // --------------------------------------------------
  // VOUCHER PRINTING ANIMATION
  // --------------------------------------------------

  if (
    session.gameFinished &&
    session.correctRounds === totalRounds &&
    voucherView === "printing"
  ) {
    return (
      <VoucherPrintingScreen
        onComplete={() => {
          setVoucherView("printed");
        }}
      />
    );
  }

  // --------------------------------------------------
  // VOUCHER PRINTED CONFIRMATION
  // --------------------------------------------------

  if (
    session.gameFinished &&
    session.correctRounds === totalRounds &&
    voucherView === "printed"
  ) {
    return (
      <VoucherPrintedScreen
        onDone={handleResetGame}
      />
    );
  }

  // --------------------------------------------------
  // EMAIL VOUCHER
  // --------------------------------------------------

  if (
    session.gameFinished &&
    session.correctRounds === totalRounds &&
    voucherView === "email"
  ) {
    return (
      <EmailVoucherScreen
        onSend={async (email) => {
          try {
            await sendVoucherEmail(email);

            setVoucherView("sent");
          } catch (error) {
            console.error(
              "Voucher email failed:",
              error
            );
          }
        }}
        onCancel={() => {
          setVoucherView("options");
        }}
      />
    );
  }

  // --------------------------------------------------
  // VOUCHER OPTIONS
  // --------------------------------------------------

  if (
    session.gameFinished &&
    session.correctRounds === totalRounds
  ) {
    return (
      <ResultsScreen
        correctRounds={session.correctRounds}
        totalRounds={totalRounds}
        onEmailVoucher={() => {
          setVoucherView("email");
        }}
      />
    );
  }

  // --------------------------------------------------
  // ACTIVE GAME
  // --------------------------------------------------

  if (
    session.gameStarted &&
    playerRole
  ) {
    return (
      <GameScreen
        playerRole={playerRole}
        reader={session.reader}
        guesser={session.guesser}
        currentRound={
          session.currentRound
        }
        roundResult={
          session.roundResult
        }
        roundStartedAt={
          session.roundStartedAt
        }
        onGuess={handleGuess}
        onNextRound={handleNextRound}
        onTimeout={handleTimeout}
        selectedLanguage={guesserLanguage}
      />
    );
  }

  // --------------------------------------------------
  // LANGUAGE SELECTION
  // --------------------------------------------------

  if (hasStarted) {
    return (
      <LanguageSelectionScreen
        confirmedLanguage={selectedLanguage}
        unavailableLanguage={unavailableLanguage}
        otherPlayerHasSelected={otherPlayerHasSelected}
        onConfirmLanguage={handleSelectLanguage}
      />
    );
  }

  // --------------------------------------------------
  // INSTRUCTIONS
  // --------------------------------------------------

  if (bothReceiptsVerified) {
    return (
      <InstructionsScreen
        onStart={handleStart}
      />
    );
  }

  // --------------------------------------------------
  // DEFAULT:
  // CALL ORDER NUMBER + SCAN RECEIPT
  // --------------------------------------------------

  return (
    <OrderScreen
      orderNumber={orderNumber}
      receiptVerified={receiptVerified}
      onVerifyReceipt={handleVerifyReceipt}
    />
  );
}