import { StyleSheet, Text, View, Pressable } from "react-native";
import { useState } from "react";


const languages = [
  "isiZulu",
  "isiXhosa",
  "Afrikaans",
  "Sepedi",
  "Setswana",
  "Sesotho",
  "itsonga",
  "siSwati",
  "Tshivenda",
  "isiNdebele",
];

type LanguageSelectionScreenProps = {
  confirmedLanguage: string;
  unavailableLanguage: string;
  onConfirmLanguage: (language: string) => void;
};

export default function LanguageSelectionScreen({
  confirmedLanguage,
  unavailableLanguage,
  onConfirmLanguage,
}: LanguageSelectionScreenProps) {
  const [temporarySelection, setTemporarySelection] = useState("");
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
    <View style={styles.container}>
        <Text style={styles.title}>Choose Your Language</Text>

        <View style={styles.languageGrid}>
        {languages.map((language) => (
            <Pressable
                key={language}
                style={styles.languageButton}
                disabled={language === unavailableLanguage}
                onPress={() => setTemporarySelection(language)}
                >
                <Text style={styles.languageText}>
                    {language}
                    {language === temporarySelection ? " ✓" : ""}
                </Text>
            </Pressable>
        ))}
        </View>

        {temporarySelection !== "" && (
            <Pressable
                style={styles.confirmButton}
                onPress={() => onConfirmLanguage(temporarySelection)}
            >
                <Text style={styles.languageText}>
                Confirm {temporarySelection}
                </Text>
            </Pressable>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    maxWidth: 900,
  },
  languageButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 160,
    alignItems: "center",
  },
  languageText: {
    fontSize: 18,
    fontWeight: "600",
  },
  confirmButton: {
    marginTop: 24,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  waitingText: {
    fontSize: 20,
    textAlign: "center",
  },
});