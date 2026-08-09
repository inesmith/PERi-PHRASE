import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import WaitingScreen from "./src/screens/WaitingScreen";
import OrderScreen from "./src/screens/OrderScreen";
import InstructionsScreen from "./src/screens/InstructionsScreen";
import LanguageSelectionScreen from "./src/screens/LanguageSelectionScreen";
import GameScreen from "./src/screens/GameScreen";

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
} from "./src/services/gameSessionService";

type ScreenSlot = "screen1" | "screen2";

export default function App() {
  const [playerRole, setPlayerRole] = useState<PlayerRole | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [screenSlot, setScreenSlot] = useState<ScreenSlot | null>(null);

  // Listen for live Firestore changes
  useEffect(() => {
    const unsubscribe = subscribeToGameSession(setSession);

    return unsubscribe;
  }, []);

  // Give this simulator a permanent screen identity
  useEffect(() => {
    const assignScreen = async () => {
      const savedSlot = await AsyncStorage.getItem("screenSlot");

      if (savedSlot === "screen1" || savedSlot === "screen2") {
        setScreenSlot(savedSlot);
        return;
      }

      const slot = await claimScreenSlot();

      if (slot) {
        await AsyncStorage.setItem("screenSlot", slot);
        setScreenSlot(slot);
      }
    };

    assignScreen();
  }, []);

  // Restore this screen's player role after an Expo refresh
  useEffect(() => {
    const loadPlayerRole = async () => {
      const savedRole = await AsyncStorage.getItem("playerRole");

      if (savedRole === "player1" || savedRole === "player2") {
        setPlayerRole(savedRole);
      }
    };

    loadPlayerRole();
  }, []);

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

  useEffect(() => {
    const resetSavedPlayerRole = async () => {
      if (!session) return;

      const sessionIsFresh =
        !session.player1Connected &&
        !session.player2Connected &&
        !session.player1ReceiptVerified &&
        !session.player2ReceiptVerified &&
        !session.player1Started &&
        !session.player2Started &&
        !session.gameStarted;

      if (sessionIsFresh) {
        await AsyncStorage.removeItem("playerRole");
        setPlayerRole(null);
      }
    };

    resetSavedPlayerRole();
  }, [session]);

  // Wait until Firestore and screen identity are ready
  if (!session || !screenSlot) {
    return null;
  }

  // --------------------------------------------------
  // SCREEN / ORDER INFORMATION
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

  const bothLanguagesSelected =
    session.player1Language !== "" &&
    session.player2Language !== "";

  // --------------------------------------------------
  // RECEIPT SCAN
  // --------------------------------------------------

  const handleVerifyReceipt = async () => {
    // This screen already has a player assigned
    if (playerRole) {
      return;
    }

    // First scanner becomes player1.
    // Second scanner becomes player2.
    const claimedRole = await claimPlayerRole();

    if (!claimedRole) {
      return;
    }

    setPlayerRole(claimedRole);

    // Remember the player's role if Expo refreshes
    await AsyncStorage.setItem("playerRole", claimedRole);

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
  // START GAME FROM INSTRUCTIONS
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

  const handleSelectLanguage = async (language: string) => {
    if (!playerRole) return;

    const success = await confirmPlayerLanguage(
      playerRole,
      language
    );

    if (!success) {
      console.log("That language was already taken.");
    }
  };

  // ==================================================
  // SCREEN FLOW
  // ==================================================

  const handleGuess = async (illustrationId: string) => {
    const result = await submitGuess(illustrationId);
    console.log("Guess result:", result);
  };

  // Player scanned first and is waiting for Player 2
  if (playerRole && receiptVerified && !bothReceiptsVerified) {
    return <WaitingScreen />;
  }

  // Both players have started and selected languages
  if (session.gameStarted && playerRole) {
    return (
      <GameScreen
        playerRole={playerRole}
        reader={session.reader}
        guesser={session.guesser}
        currentRound={session.currentRound}
        onGuess={handleGuess}
        roundResult={session.roundResult}
      />
    );
  }

  // Both players pressed Start -> language selection
  if (bothPlayersStarted) {
    return (
      <LanguageSelectionScreen
        confirmedLanguage={selectedLanguage}
        unavailableLanguage={unavailableLanguage}
        onConfirmLanguage={handleSelectLanguage}
      />
    );
  }

  // Both receipts verified -> instructions
  if (bothReceiptsVerified) {
    return (
      <InstructionsScreen
        hasStarted={hasStarted}
        onStart={handleStart}
      />
    );
  }

  // Default opening screen:
  // show this physical screen's order number
  return (
    <OrderScreen
      orderNumber={orderNumber}
      receiptVerified={receiptVerified}
      onVerifyReceipt={handleVerifyReceipt}
    />
  );
}