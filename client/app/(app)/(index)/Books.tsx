import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedView";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Button from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as DocumentPicker from "expo-document-picker";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { useAddBookCallback, useBooksTable } from "@/stores/UserStore";

// Book data structure (should align with UserStore schema)
interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  bookUrl: string;
  progress?: number;
  lastLocation?: string;
}

export default function Books() {
  const [isLoading, setIsLoading] = useState(false); // For async operations like loading progress
  const addBook = useAddBookCallback();
  const booksTable = useBooksTable();

  const [localBooksWithProgress, setLocalBooksWithProgress] = useState<Book[]>(
    []
  );

  const backgroundColor = useThemeColor({}, "background");

  // Load books from TinyBase and then their reading progress
  useEffect(() => {
    const processBooks = async () => {
      if (!booksTable) {
        setLocalBooksWithProgress([]);
        return;
      }
      setIsLoading(true);
      try {
        // Convert booksTable (object of rows) to an array of Book objects
        const booksFromStore: Book[] = Object.values(booksTable)
          .map(
            (bookData) => bookData as unknown as Book // Cast assuming schema compatibility
          )
          .filter((book) => book && book.id && book.bookUrl); // Ensure essential fields

        const updatedBooksWithProgress = await Promise.all(
          booksFromStore.map(async (book) => {
            if (!book || !book.bookUrl) return book; // Should already be filtered, but good check
            const progressKey = `reading-progress-${book.bookUrl}`;
            const progressData = await AsyncStorage.getItem(progressKey);
            let progressInfo: Partial<Book> = {
              // Use progress from store as a base, can be overwritten by AsyncStorage
              progress: book.progress !== undefined ? book.progress : 0,
            };

            if (progressData) {
              const parsedProgress = JSON.parse(progressData);
              progressInfo = {
                ...progressInfo, // Keep store progress if not in parsedProgress
                lastLocation: parsedProgress.location,
              };
            }
            return {
              ...book,
              ...progressInfo,
            };
          })
        );
        // Filter out any books that might have become null/undefined during mapping (e.g., if a map operation could return undefined)
        setLocalBooksWithProgress(
          updatedBooksWithProgress.filter((b) => b) as Book[]
        );
      } catch (error) {
        console.error("Failed to load books or reading progress:", error);
        setLocalBooksWithProgress([]); // Clear on error
      }
      setIsLoading(false);
    };

    processBooks();
  }, [booksTable]); // React to changes in the entire booksTable

  // Handle book selection to open the reader
  const handleBookSelect = (book: Book) => {
    router.replace({
      pathname: "/(app)/Reading",
      params: {
        url: book.bookUrl,
        title: book.title,
      },
    });
  };

  // Render an individual book item
  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.bookCoverContainer}>
        <Image
          source={{ uri: item.coverUrl }}
          style={styles.bookCover}
          resizeMode="cover"
        />
        {item.progress !== undefined && (
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${item.progress}%` }]}
            />
          </View>
        )}
      </View>
      <View style={styles.bookInfo}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText type="subtitle" numberOfLines={1} style={styles.authorText}>
          {item.author}
        </ThemedText>
        {item.progress !== undefined && (
          <ThemedText type="default" style={styles.progressText}>
            {item.progress}% completed
          </ThemedText>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  // Handle adding a custom book
  const handleAddBook = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/epub+zip", // Filter for EPUB files
        copyToCacheDirectory: true, // Copies to a temporary cache directory
      });

      console.log("DocumentPicker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.uri && asset.name) {
          const bookId = randomUUID();
          const fileExtension = asset.name.split(".").pop() || "epub";
          const newFileName = `${bookId}.${fileExtension}`;
          const booksDir = `${FileSystem.documentDirectory}books/`;

          // Ensure the 'books' directory exists
          await FileSystem.makeDirectoryAsync(booksDir, {
            intermediates: true,
          });

          const newBookPath = `${booksDir}${newFileName}`;

          // Copy the file from cache to the persistent document directory
          await FileSystem.copyAsync({
            from: asset.uri, // Cache URI from DocumentPicker
            to: newBookPath, // New persistent URI
          });

          const newBook = {
            id: bookId,
            title: asset.name.replace(/\.epub$/i, ""),
            author: "Unknown Author", // Placeholder, consider EPUB metadata parsing for real app
            coverUrl: "", // Placeholder
            bookUrl: newBookPath, // Store the persistent local file URI
          };

          addBook(newBook);
          console.log("Book added to store with new path:", newBook);

          // The useEffect listening to booksTable will automatically update localBooksWithProgress
        } else {
          console.log("DocumentPicker result missing URI or name");
        }
      } else {
        console.log("DocumentPicker cancelled or no assets selected");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      // Handle errors, e.g., show a toast message
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.pageTitle}>
        My Library
      </ThemedText>

      <FlatList
        data={localBooksWithProgress} // Use the state variable that includes progress
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
      />

      <Button
        variant="primary"
        onPress={handleAddBook}
        style={styles.addButton}
      >
        Add Book
        <MaterialIcons name="add" size={24} color="white" />
      </Button>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  pageTitle: {
    marginBottom: 24,
  },
  booksList: {
    paddingBottom: 80, // Space for the add button
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 12,
  },
  bookCoverContainer: {
    position: "relative",
    marginRight: 12,
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4285F4",
  },
  bookInfo: {
    flex: 1,
    marginRight: 8,
  },
  authorText: {
    marginTop: 4,
    opacity: 0.7,
  },
  progressText: {
    marginTop: 8,
    color: "#4285F4",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 16,
    left: 16,
    borderRadius: 28,
  },
});
