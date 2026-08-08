export type GameSession = {
  player1Connected: boolean;
  player2Connected: boolean;

  player1Ready: boolean;
  player2Ready: boolean;

  player1Language: string;
  player2Language: string;

  gameStarted: boolean;

  currentRound: number;
  currentTurn: "player1" | "player2";

  player1Score: number;
  player2Score: number;
};