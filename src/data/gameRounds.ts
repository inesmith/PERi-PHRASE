import { ImageSourcePropType } from "react-native";

export type PrototypeLanguage =
  | "Afrikaans"
  | "isiZulu";

export type GameRound = {
  id: string;

  // Temporary fallback until phrase artwork exists
  phrase: string;

  phraseImage?: ImageSourcePropType;

  illustrations: {
    id: string;
    label: string;
    image?: ImageSourcePropType;
  }[];

  correctIllustrationId: string;
};

export const languageRoundSets: Record<
  PrototypeLanguage,
  GameRound[]
> = {
  Afrikaans: [
    {
  id: "afrikaans001",
  phrase: "Wat brand twee keer?",

  phraseImage: require(
    "../assets/phrases/afrikaans/afrikaans-3.png"
  ),

  illustrations: [
        { id: "illustration001", label: "Chilli", image: require("../assets/images/Chili.png") },
        { id: "illustration002", label: "BucketHat", image: require("../assets/images/BucketHat.png") },
        { id: "illustration003", label: "Braai", image: require("../assets/images/Braai.png") },
        { id: "illustration004", label: "Flame", image: require("../assets/images/Flame.png") },
        { id: "illustration005", label: "Heart", image: require("../assets/images/Heart.png") },
        { id: "illustration006", label: "Vuvuzela", image: require("../assets/images/Vuvuzela.png") },
        { id: "illustration007", label: "Springbok", image: require("../assets/images/Springbok.png") },
        { id: "illustration008", label: "PotjiePot", image: require("../assets/images/PotjiePot.png") },
        { id: "illustration009", label: "FlipFlops", image: require("../assets/images/FlipFlops.png") },
      ],

      correctIllustrationId: "illustration001",
    },

    {
      id: "afrikaans002",
      phrase: "Suid-Afrika se vlieënde wekker",

      phraseImage: require(
        "../assets/phrases/afrikaans/afrikaans-2.png"
      ),

      illustrations: [
        { id: "illustration019", label: "Taxi", image: require("../assets/images/Taxi.png") },
        { id: "illustration020", label: "PotjiePot", image: require("../assets/images/PotjiePot.png") },
        { id: "illustration021", label: "Flame", image: require("../assets/images/Flame.png") },
        { id: "illustration022", label: "Braai", image: require("../assets/images/Braai.png") },
        { id: "illustration023", label: "Heart", image: require("../assets/images/Heart.png") },
        { id: "illustration024", label: "BeachBall", image: require("../assets/images/BeachBall.png") },
        { id: "illustration025", label: "FishingRod", image: require("../assets/images/FishingRod.png") },
        { id: "illustration026", label: "Vuvuzela", image: require("../assets/images/Vuvuzela.png") },
        { id: "illustration027", label: "Hadeda", image: require("../assets/images/Hadeda.png") },
      ],

      correctIllustrationId: "illustration027",
    },

    {
      id: "afrikaans003",
      phrase: "Gooi my uit en wag vir 'n byt",

      phraseImage: require(
        "../assets/phrases/afrikaans/afrikaans-1.png"
      ),

      illustrations: [
        { id: "illustration037", label: "Springbok", image: require("../assets/images/Springbok.png") },
        { id: "illustration038", label: "Chilli", image: require("../assets/images/Chili.png") },
        { id: "illustration039", label: "FishingRod", image: require("../assets/images/FishingRod.png") },
        { id: "illustration040", label: "FlipFlops", image: require("../assets/images/FlipFlops.png") },
        { id: "illustration041", label: "Taxi", image: require("../assets/images/Taxi.png") },
        { id: "illustration042", label: "BucketHat", image: require("../assets/images/BucketHat.png") },
        { id: "illustration043", label: "BeachBall", image: require("../assets/images/BeachBall.png") },
        { id: "illustration044", label: "Vuvuzela", image: require("../assets/images/Vuvuzela.png") },
        { id: "illustration045", label: "PotjiePot", image: require("../assets/images/PotjiePot.png") },
      ],

      correctIllustrationId: "illustration039",
    },
  ],

  isiZulu: [
    {
      id: "isizulu001",
      phrase: "isiZulu phrase 1",

      illustrations: [
        { id: "illustration010", label: "Vuvuzela", image: require("../assets/images/Vuvuzela.png") },
        { id: "illustration011", label: "BeachBall", image: require("../assets/images/BeachBall.png") },
        { id: "illustration012", label: "FlipFlops", image: require("../assets/images/FlipFlops.png") },
        { id: "illustration013", label: "BucketHat", image: require("../assets/images/BucketHat.png") },
        { id: "illustration014", label: "PotjiePot", image: require("../assets/images/PotjiePot.png") },
        { id: "illustration015", label: "Flame", image: require("../assets/images/Flame.png") },
        { id: "illustration016", label: "FishingRod", image: require("../assets/images/FishingRod.png") },
        { id: "illustration017", label: "Heart", image: require("../assets/images/Heart.png") },
        { id: "illustration018", label: "Springbok", image: require("../assets/images/Springbok.png") },
      ],

      correctIllustrationId: "illustration010",
    },

    {
      id: "isizulu002",
      phrase: "isiZulu phrase 2",

      illustrations: [
        { id: "illustration028", label: "PotjiePot", image: require("../assets/images/PotjiePot.png") },
        { id: "illustration029", label: "Springbok", image: require("../assets/images/Springbok.png") },
        { id: "illustration030", label: "Flame", image: require("../assets/images/Flame.png") },
        { id: "illustration031", label: "Braai", image: require("../assets/images/Braai.png") },
        { id: "illustration032", label: "Chilli", image: require("../assets/images/Chili.png") },
        { id: "illustration033", label: "Taxi", image: require("../assets/images/Taxi.png") },
        { id: "illustration034", label: "BeachBall", image: require("../assets/images/BeachBall.png") },
        { id: "illustration035", label: "Hadeda", image: require("../assets/images/Hadeda.png") },
        { id: "illustration036", label: "FlipFlops", image: require("../assets/images/FlipFlops.png") },
      ],

      correctIllustrationId: "illustration033",
    },

    {
      id: "isizulu003",
      phrase: "isiZulu phrase 3",

      illustrations: [
        { id: "illustration046", label: "Heart", image: require("../assets/images/Heart.png") },
        { id: "illustration047", label: "BucketHat", image: require("../assets/images/BucketHat.png") },
        { id: "illustration048", label: "Braai", image: require("../assets/images/Braai.png") },
        { id: "illustration049", label: "Hadeda", image: require("../assets/images/Hadeda.png") },
        { id: "illustration050", label: "Flame", image: require("../assets/images/Flame.png") },
        { id: "illustration051", label: "Chilli", image: require("../assets/images/Chili.png") },
        { id: "illustration052", label: "FishingRod", image: require("../assets/images/FishingRod.png") },
        { id: "illustration053", label: "FlipFlops", image: require("../assets/images/FlipFlops.png") },
        { id: "illustration054", label: "BeachBall", image: require("../assets/images/BeachBall.png") },
      ],

      correctIllustrationId: "illustration047",
    },
  ],
};

export const TOTAL_ROUNDS = 6;

export function getRoundSetIndex(
  currentRound: number
) {
  return Math.floor((currentRound - 1) / 2);
}

export function getGameRound(
  currentRound: number,
  language: PrototypeLanguage
) {
  const setIndex = getRoundSetIndex(currentRound);

  return languageRoundSets[language][setIndex];
}