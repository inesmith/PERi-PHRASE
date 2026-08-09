import {
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { GameSession } from "../types/GameSession";

const sessionRef = doc(db, "gameSessions", "session001");

export function subscribeToGameSession(
  callback: (session: GameSession) => void
) {
  return onSnapshot(sessionRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as GameSession);
    }
  });
}

export async function updateGameSession(
  updates: Partial<GameSession>
) {
  await updateDoc(sessionRef, updates);
}

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

    if (data.firstStarter === null) {
      updates.firstStarter = role;
    }

    transaction.update(sessionRef, updates);
  });
}

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

    const guesser = data.firstStarter;
    const reader =
      data.firstStarter === "player1"
        ? "player2"
        : "player1";

    transaction.update(sessionRef, {
      currentRound: 1,
      guesser,
      reader,
      currentPhraseId: "phrase001",
      correctIllustrationId: "illustration001",
      roundResult: "playing",
      gameStarted: true,
    });
  });
}

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

    // Someone else already confirmed this language
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