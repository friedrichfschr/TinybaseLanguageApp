import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedSafeAreaView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Reader, ReaderProvider, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";

// Type definition for selected word data
type SelectedWordData = {
  word: string;
  sentence: string;
  cfi: string; // Content File Identifier used for highlighting
};

// Book reading progress type
type ReadingProgress = {
  location: string;
  timestamp: number;
};

// Menu item type for the selection menu
type SelectionMenuItem = {
  id: string;
  label: string;
  onPress: (selection: any) => void;
};

// The ReaderContent component handles the epub reader functionality
function ReaderContent() {
  const { width, height } = useWindowDimensions();
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const readerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<SelectedWordData | null>(
    null
  );
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  const { location, goToLocation } = useReader();

  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");

  // Load saved reading progress on component mount
  useEffect(() => {
    if (!url) return;

    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem(
          `book-progress-${url}`
        );
        if (savedProgress) {
          const { location } = JSON.parse(savedProgress) as ReadingProgress;
          goToLocation(location);
        }
      } catch (error) {
        console.error("Failed to load reading progress:", error);
      }
    };

    loadProgress();
  }, [url, goToLocation]);

  // Save reading progress when location changes
  useEffect(() => {
    if (!url || !location) return;

    const saveProgress = async () => {
      try {
        const progress: ReadingProgress = {
          location,
          timestamp: Date.now(),
        };
        await AsyncStorage.setItem(
          `book-progress-${url}`,
          JSON.stringify(progress)
        );
      } catch (error) {
        console.error("Failed to save reading progress:", error);
      }
    };

    saveProgress();
  }, [url, location]);

  // Extract sentence context from the selected text
  const extractSentence = (text: string, wordToFind: string): string => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(wordToFind.toLowerCase())) {
        return sentence.trim();
      }
    }

    return text;
  };

  // Handle text selection in the epub reader
  const handleSelected = (selection: any) => {
    if (!selection || !selection.text) return;

    const words = selection.text.trim().split(/\s+/);

    // Only process if it's a single word selection
    if (words.length === 1) {
      const word = words[0].replace(/[^\w'-]/g, ""); // Clean punctuation except apostrophes/hyphens

      // Get the surrounding text for context
      // @ts-ignore - The rendition property may not be in type definitions
      if (readerRef.current && readerRef.current.rendition) {
        // @ts-ignore - Access the internal API
        readerRef.current.rendition.book
          .getRange(selection.cfi)
          .then((range: any) => {
            let contextText = "";
            if (
              range &&
              range.startContainer &&
              range.startContainer.textContent
            ) {
              contextText = range.startContainer.textContent;
            } else {
              contextText = selection.text; // Fallback
            }

            const sentence = extractSentence(contextText, word);

            setSelectedWord({
              word,
              sentence,
              cfi: selection.cfi,
            });

            setShowTranslationModal(true);
          })
          .catch((error: any) => {
            console.error("Error getting text range:", error);
            // Fallback if we can't get the range
            setSelectedWord({
              word,
              sentence: selection.text,
              cfi: selection.cfi,
            });
            setShowTranslationModal(true);
          });
      }
    }
  };

  // Handle closing the translation modal
  const handleCloseModal = () => {
    setShowTranslationModal(false);
  };

  // Handle translation request (to be implemented by user)
  const handleTranslate = () => {
    // This will be implemented by the user later
    console.log("Translate word:", selectedWord?.word);
    console.log("Context sentence:", selectedWord?.sentence);
    handleCloseModal();
  };

  // Selection menu items
  const selectionMenuItems: SelectionMenuItem[] = [
    {
      id: "translate",
      label: "Translate",
      onPress: handleSelected,
    },
  ];

  // Book URL from params or a default URL
  const bookUrl = url || "https://s3.amazonaws.com/epubjs/books/moby-dick.epub";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          onPress={() => router.replace("/(app)/(index)/Books")}
          style={styles.backButton}
        >
          <ThemedText>← Back</ThemedText>
        </Button>
        <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
          {title || "Reading"}
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.readerContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={primaryColor} />
            <ThemedText style={styles.loadingText}>Loading book...</ThemedText>
          </View>
        )}

        <Reader
          ref={readerRef}
          src={bookUrl}
          width={width}
          height={height - 100}
          fileSystem={useFileSystem}
          onReady={() => setIsLoading(false)}
          enableSwipe={true}
          enableSelection={true}
          onSelected={handleSelected}
          menuItems={selectionMenuItems}
        />
      </View>

      {/* Translation Modal */}
      <Modal
        visible={showTranslationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Translation
            </ThemedText>

            {selectedWord && (
              <>
                <View style={styles.wordContainer}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.selectedWord}
                  >
                    {selectedWord.word}
                  </ThemedText>
                </View>

                <View style={styles.sentenceContainer}>
                  <ThemedText style={styles.contextLabel}>Context:</ThemedText>
                  <ThemedText style={styles.sentenceText}>
                    {selectedWord.sentence}
                  </ThemedText>
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                onPress={handleCloseModal}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={handleTranslate}
                style={styles.modalButton}
              >
                Translate
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Main Reading component wrapped with ReaderProvider
export default function Reading() {
  return (
    <ThemedSafeAreaView style={styles.safeAreaContainer}>
      <StatusBar style="auto" />
      <ReaderProvider>
        <ReaderContent />
      </ReaderProvider>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  placeholder: {
    width: 50,
  },
  readerContainer: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
  },
  // Translation modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  wordContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
  },
  selectedWord: {
    fontSize: 22,
  },
  sentenceContainer: {
    marginBottom: 20,
  },
  contextLabel: {
    marginBottom: 8,
    fontWeight: "500",
  },
  sentenceText: {
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
