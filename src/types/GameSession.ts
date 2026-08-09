export type GameSession = {
  player1Connected: boolean;
  player2Connected: boolean;

  player1OrderNumber: string;
  player2OrderNumber: string;

  player1ReceiptVerified: boolean;
  player2ReceiptVerified: boolean;

  player1Started: boolean;
  player2Started: boolean;

  firstStarter: "player1" | "player2" | null;

  player1Language: string;
  player2Language: string;

  gameStarted: boolean;

  currentRound: number;
  currentTurn: "player1" | "player2";

  player1Score: number;
  player2Score: number;

  screen1OrderNumber: string;
  screen2OrderNumber: string;

  screen1Claimed: boolean;
  screen2Claimed: boolean;

  reader: "player1" | "player2";
  guesser: "player1" | "player2";

  currentPhraseId: string;
  correctIllustrationId: string;

  roundResult: "playing" | "correct" | "incorrect" | "timeout";

  correctRounds: number;

  gameFinished: boolean;
};