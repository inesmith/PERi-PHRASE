import { ImageSourcePropType } from "react-native";
import { SupportedLanguage } from "./languages";

export type GameRound = {
  id: string;

  // Temporary fallback while the real phrase artwork
  // has not been exported yet.
  phrase: string;

  // Later each language will point to its own PNG/JPG asset.
  phraseImages?: Partial<
    Record<SupportedLanguage, ImageSourcePropType>
  >;

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
      { id: "illustration001", label: "Illustration 1" },
      { id: "illustration002", label: "Illustration 2" },
      { id: "illustration003", label: "Illustration 3" },
      { id: "illustration004", label: "Illustration 4" },
      { id: "illustration005", label: "Illustration 5" },
      { id: "illustration006", label: "Illustration 6" },
      { id: "illustration007", label: "Illustration 7" },
      { id: "illustration008", label: "Illustration 8" },
      { id: "illustration009", label: "Illustration 9" },
    ],

    correctIllustrationId: "illustration001",
  },

  {
    id: "phrase002",
    phrase: "Round 2 test phrase",

    illustrations: [
      { id: "illustration010", label: "Illustration 10" },
      { id: "illustration011", label: "Illustration 11" },
      { id: "illustration012", label: "Illustration 12" },
      { id: "illustration013", label: "Illustration 13" },
      { id: "illustration014", label: "Illustration 14" },
      { id: "illustration015", label: "Illustration 15" },
      { id: "illustration016", label: "Illustration 16" },
      { id: "illustration017", label: "Illustration 17" },
      { id: "illustration018", label: "Illustration 18" },
    ],

    correctIllustrationId: "illustration013",
  },

  {
    id: "phrase003",
    phrase: "Round 3 test phrase",

    illustrations: [
      { id: "illustration019", label: "Illustration 19" },
      { id: "illustration020", label: "Illustration 20" },
      { id: "illustration021", label: "Illustration 21" },
      { id: "illustration022", label: "Illustration 22" },
      { id: "illustration023", label: "Illustration 23" },
      { id: "illustration024", label: "Illustration 24" },
      { id: "illustration025", label: "Illustration 25" },
      { id: "illustration026", label: "Illustration 26" },
      { id: "illustration027", label: "Illustration 27" },
    ],

    correctIllustrationId: "illustration022",
  },

  {
    id: "phrase004",
    phrase: "Round 4 test phrase",

    illustrations: [
      { id: "illustration028", label: "Illustration 28" },
      { id: "illustration029", label: "Illustration 29" },
      { id: "illustration030", label: "Illustration 30" },
      { id: "illustration031", label: "Illustration 31" },
      { id: "illustration032", label: "Illustration 32" },
      { id: "illustration033", label: "Illustration 33" },
      { id: "illustration034", label: "Illustration 34" },
      { id: "illustration035", label: "Illustration 35" },
      { id: "illustration036", label: "Illustration 36" },
    ],

    correctIllustrationId: "illustration036",
  },

  {
    id: "phrase005",
    phrase: "Round 5 test phrase",

    illustrations: [
      { id: "illustration037", label: "Illustration 37" },
      { id: "illustration038", label: "Illustration 38" },
      { id: "illustration039", label: "Illustration 39" },
      { id: "illustration040", label: "Illustration 40" },
      { id: "illustration041", label: "Illustration 41" },
      { id: "illustration042", label: "Illustration 42" },
      { id: "illustration043", label: "Illustration 43" },
      { id: "illustration044", label: "Illustration 44" },
      { id: "illustration045", label: "Illustration 45" },
    ],

    correctIllustrationId: "illustration042",
  },

  {
    id: "phrase006",
    phrase: "Round 6 test phrase",

    illustrations: [
      { id: "illustration046", label: "Illustration 46" },
      { id: "illustration047", label: "Illustration 47" },
      { id: "illustration048", label: "Illustration 48" },
      { id: "illustration049", label: "Illustration 49" },
      { id: "illustration050", label: "Illustration 50" },
      { id: "illustration051", label: "Illustration 51" },
      { id: "illustration052", label: "Illustration 52" },
      { id: "illustration053", label: "Illustration 53" },
      { id: "illustration054", label: "Illustration 54" },
    ],

    correctIllustrationId: "illustration049",
  },
];