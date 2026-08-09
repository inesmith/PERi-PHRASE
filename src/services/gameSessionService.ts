import {
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import {
  GameSession,
  RoundHistoryItem,
} from "../types/GameSession";
import { gameRounds } from "../data/gameRounds";

const sessionRef = doc(db, "gameSessions", "session001");

// --------------------------------------------------
// LIVE SESSION LISTENER
// --------------------------------------------------

export function subscribeToGameSession(
  callback: (session: GameSession) => void
) {
  return onSnapshot(sessionRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as GameSession);
    }
  });
}

// --------------------------------------------------
// GENERAL SESSION UPDATE
// --------------------------------------------------

export async function updateGameSession(
  updates: Partial<GameSession>
) {
  await updateDoc(sessionRef, updates);
}

// --------------------------------------------------
// PLAYER START
// --------------------------------------------------

export async function startPlayer(
  role: "player1" | "player2"
) {
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Game session does not exist.");
    }

    const data = snapshot.data() as GameSession;

    const updates: Partial<GameSession> = {};

    if (role === "player1") {
      updates.player1Started = true;
    } else {
      updates.player2Started = true;
    }

    // Remember who pressed Start first
    if (data.firstStarter === null) {
      updates.firstStarter = role;
    }

    transaction.update(sessionRef, updates);
  });
}

// --------------------------------------------------
// CLAIM PLAYER ROLE
// First receipt scanner = Player 1
// Second receipt scanner = Player 2
// --------------------------------------------------

export async function claimPlayerRole(): Promise<
  "player1" | "player2" | null
> {
  return await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Game session does not exist.");
    }

    const data = snapshot.data() as GameSession;

    if (!data.player1Connected) {
      transaction.update(sessionRef, {
        player1Connected: true,
      });

      return "player1";
    }

    if (!data.player2Connected) {
      transaction.update(sessionRef, {
        player2Connected: true,
      });

      return "player2";
    }

    return null;
  });
}

// --------------------------------------------------
// CLAIM PHYSICAL SCREEN SLOT
// --------------------------------------------------

export async function claimScreenSlot(): Promise<
  "screen1" | "screen2" | null
> {
  return await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Game session does not exist.");
    }

    const data = snapshot.data() as GameSession;

    if (!data.screen1Claimed) {
      transaction.update(sessionRef, {
        screen1Claimed: true,
      });

      return "screen1";
    }

    if (!data.screen2Claimed) {
      transaction.update(sessionRef, {
        screen2Claimed: true,
      });

      return "screen2";
    }

    return null;
  });
}

// --------------------------------------------------
// INITIALIZE ROUND 1
// --------------------------------------------------

export async function initializeGameRound() {
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Game session does not exist.");
    }

    const data = snapshot.data() as GameSession;

    if (!data.firstStarter) {
      throw new Error("First starter has not been set.");
    }

    // First person to press Start gets the illustrations first
    const guesser = data.firstStarter;

    const reader =
      data.firstStarter === "player1"
        ? "player2"
        : "player1";

    const firstRound = gameRounds[0];

    transaction.update(sessionRef, {
      currentRound: 1,

      guesser,
      reader,

      currentPhraseId: firstRound.id,
      correctIllustrationId:
        firstRound.correctIllustrationId,

      roundResult: "playing",
      roundStartedAt: Date.now(),

      gameStarted: true,
      gameFinished: false,
    });
  });
}

// --------------------------------------------------
// SAFE LANGUAGE CONFIRMATION
// --------------------------------------------------

export async function confirmPlayerLanguage(
  role: "player1" | "player2",
  language: string
): Promise<boolean> {
  return await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Game session does not exist.");
    }

    const data = snapshot.data() as GameSession;

    const otherPlayerLanguage =
      role === "player1"
        ? data.player2Language
        : data.player1Language;

    // The other player already confirmed this language
    if (otherPlayerLanguage === language) {
      return false;
    }

    if (role === "player1") {
      transaction.update(sessionRef, {
        player1Language: language,
      });
    } else {
      transaction.update(sessionRef, {
        player2Language: language,
      });
    }

    return true;
  });
}

// --------------------------------------------------
// SUBMIT ILLUSTRATION GUESS
// --------------------------------------------------

export async function submitGuess(
  illustrationId: string
): Promise<"correct" | "incorrect"> {
  return await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Game session does not exist.");
    }

    const data = snapshot.data() as GameSession;

    // A round can only receive one result
    if (data.roundResult !== "playing") {
      return data.roundResult === "correct"
        ? "correct"
        : "incorrect";
    }

    const isCorrect =
      illustrationId === data.correctIllustrationId;

    const result: "correct" | "incorrect" =
      isCorrect ? "correct" : "incorrect";

    const historyItem: RoundHistoryItem = {
      roundNumber: data.currentRound,
      phraseId: data.currentPhraseId,
      result,
    };

    transaction.update(sessionRef, {
      roundResult: result,

      correctRounds: isCorrect
        ? data.correctRounds + 1
        : data.correctRounds,

      roundHistory: [
        ...data.roundHistory,
        historyItem,
      ],
    });

    return result;
  });
}

// --------------------------------------------------
// ROUND TIMEOUT
// --------------------------------------------------

export async function submitTimeout() {
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Game session does not exist.");
    }

    const data = snapshot.data() as GameSession;

    // Ignore timeout if the round already ended
    if (data.roundResult !== "playing") {
      return;
    }

    const historyItem: RoundHistoryItem = {
      roundNumber: data.currentRound,
      phraseId: data.currentPhraseId,
      result: "timeout",
    };

    transaction.update(sessionRef, {
      roundResult: "timeout",

      roundHistory: [
        ...data.roundHistory,
        historyItem,
      ],
    });
  });
}

// --------------------------------------------------
// ADVANCE ROUND / VIEW FINAL RESULTS
// --------------------------------------------------

export async function advanceToNextRound() {
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);

    if (!snapshot.exists()) {
      throw new Error("Game session does not exist.");
    }

    const data = snapshot.data() as GameSession;

    // Don't advance while the round is still active
    if (data.roundResult === "playing") {
      return;
    }

    // Round 6 is finished.
    // The final button now means "View Results".
    if (data.currentRound >= gameRounds.length) {
      transaction.update(sessionRef, {
        gameFinished: true,
      });

      return;
    }

    const nextRoundNumber = data.currentRound + 1;

    const nextRoundData =
      gameRounds[nextRoundNumber - 1];

    // Swap Reader and Guesser
    const nextReader = data.guesser;
    const nextGuesser = data.reader;

    transaction.update(sessionRef, {
      currentRound: nextRoundNumber,

      reader: nextReader,
      guesser: nextGuesser,

      currentPhraseId: nextRoundData.id,
      correctIllustrationId:
        nextRoundData.correctIllustrationId,

      roundStartedAt: Date.now(),
      roundResult: "playing",
    });
  });
}

export async function resetGameSession() {
  await updateDoc(sessionRef, {
    player1Connected: false,
    player2Connected: false,

    player1ReceiptVerified: false,
    player2ReceiptVerified: false,

    player1Started: false,
    player2Started: false,

    player1Language: "",
    player2Language: "",

    firstStarter: null,

    gameStarted: false,
    gameFinished: false,

    currentRound: 1,
    currentTurn: "player1",

    reader: "player2",
    guesser: "player1",

    currentPhraseId: "phrase001",
    correctIllustrationId: "illustration001",

    roundResult: "playing",
    roundStartedAt: 0,

    correctRounds: 0,
    roundHistory: [],
  });
}