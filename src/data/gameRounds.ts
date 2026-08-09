export type GameRound = {
  id: string;
  phrase: string;
  illustrations: {
    id: string;
    label: string;
  }[];
  correctIllustrationId: string;
};

export const gameRounds: GameRound[] = [
  {
    id: "phrase001",
    phrase: "Round 1 test phrase",
    illustrations: [
      {
        id: "illustration001",
        label: "Illustration 1",
      },
      {
        id: "illustration002",
        label: "Illustration 2",
      },
      {
        id: "illustration003",
        label: "Illustration 3",
      },
      {
        id: "illustration004",
        label: "Illustration 4",
      },
    ],
    correctIllustrationId: "illustration001",
  },
];