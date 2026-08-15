import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { languages } from "../data/languages";

type LanguageSelectionScreenProps = {
  confirmedLanguage: string;
  unavailableLanguage: string;
  onConfirmLanguage: (language: string) => void;
};

const languageButtonImages = {
  isiZulu: {
    default: require("../assets/buttons/isiZulu-default.png"),
    selected: require("../assets/buttons/isiZulu-selected.png"),
  },
  isiXhosa: {
    default: require("../assets/buttons/isiXhosa-default.png"),
    selected: require("../assets/buttons/isiXhosa-selected.png"),
  },
  Afrikaans: {
    default: require("../assets/buttons/afrikaans-default.png"),
    selected: require("../assets/buttons/afrikaans-selected.png"),
  },
  Sepedi: {
    default: require("../assets/buttons/sepedi-default.png"),
    selected: require("../assets/buttons/sepedi-selected.png"),
  },
  Setswana: {
    default: require("../assets/buttons/setswana-default.png"),
    selected: require("../assets/buttons/setswana-selected.png"),
  },
  Sesotho: {
    default: require("../assets/buttons/sesotho-default.png"),
    selected: require("../assets/buttons/sesotho-selected.png"),
  },
  Xitsonga: {
    default: require("../assets/buttons/xitsonga-default.png"),
    selected: require("../assets/buttons/xitsonga-selected.png"),
  },
  siSwati: {
    default: require("../assets/buttons/siswati-default.png"),
    selected: require("../assets/buttons/siswati-selected.png"),
  },
  Tshivenda: {
    default: require("../assets/buttons/tshivenda-default.png"),
    selected: require("../assets/buttons/tshivenda-selected.png"),
  },
  isiNdebele: {
    default: require("../assets/buttons/isindebele-default.png"),
    selected: require("../assets/buttons/isindebele-selected.png"),
  },
};

export default function LanguageSelectionScreen({
  confirmedLanguage,
  unavailableLanguage,
  onConfirmLanguage,
}: LanguageSelectionScreenProps) {
  const [temporarySelection, setTemporarySelection] = useState("");

  useEffect(() => {
    if (
      temporarySelection !== "" &&
      temporarySelection === unavailableLanguage
    ) {
      setTemporarySelection("");
    }
  }, [temporarySelection, unavailableLanguage]);

  if (confirmedLanguage !== "") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Language confirmed!</Text>

        <Text style={styles.waitingText}>
          You chose {confirmedLanguage}
        </Text>

        <Text style={styles.waitingText}>
          Waiting for the other player to choose a language...
        </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/background/language-background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/phrases/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Choose your language</Text>

        <View style={styles.languageGrid}>
          {languages.map((language) => {
            const isSelected = language === temporarySelection;
            const isUnavailable = language === unavailableLanguage;

            const images =
              languageButtonImages[
                language as keyof typeof languageButtonImages
              ];

            return (
              <Pressable
                key={language}
                disabled={isUnavailable}
                onPress={() => setTemporarySelection(language)}
                style={[
                  styles.languageButtonWrapper,
                  isUnavailable && styles.unavailableButton,
                ]}
              >
                <View style={styles.languageImageFrame}>
                  <Image
                    source={
                      isSelected
                        ? images.selected
                        : images.default
                    }
                    style={[
                      styles.languageImage,
                      isSelected && styles.selectedLanguageImage,
                    ]}
                    resizeMode="contain"
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.confirmButtonSpace}>
          <Pressable
            disabled={temporarySelection === ""}
            style={[
              styles.confirmButton,
              temporarySelection === "" && styles.hiddenConfirmButton,
            ]}
            onPress={() => onConfirmLanguage(temporarySelection)}
          >
            <Image
              source={require("../assets/buttons/start-game.png")}
              style={styles.startImage}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    width: 850,
    height: 438,
    transform: [{ rotate: "-3deg" }],
  },

  title: {
    fontSize: 96,
    fontFamily: "Nandos-Regular",
    marginTop: 140,
  },

  languageGrid: {
    width: 2000,

    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",

    rowGap: 37,

    marginTop: 100,

    transform: [{ translateY: 30 }],
  },

  confirmButton: {
    marginTop: 24,
  },

  languageButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 160,
    alignItems: "center",
  },

  startImage: {
    width: 914,
    height: 177,
    marginTop: 130,
  },

  waitingText: {
    fontSize: 20,
    textAlign: "center",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  languageImage: {
    width: "100%",
    height: "100%",
  },

  selectedLanguageImage: {
    transform: [{ translateY: 3 }],
  },

  unavailableButton: {
    opacity: 0.4,
  },

  languageText: {
    fontSize: 18,
    fontWeight: "600",
  },

  languageButtonWrapper: {
    marginHorizontal: -25,
  },

  languageImageFrame: {
    width: 440,
    height: 200,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "visible",
  },

  confirmButtonSpace: {
    height: 80,
  },

  hiddenConfirmButton: {
    opacity: 0,
  },
});