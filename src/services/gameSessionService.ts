import { doc, onSnapshot, updateDoc } from "firebase/firestore";
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