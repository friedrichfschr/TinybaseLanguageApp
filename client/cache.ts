import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { TokenCache } from "@clerk/clerk-expo";

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log("Token retrieved from cache:", item);
        } else {
          console.log("No token found in cache for key:", key);
          return null;
        }
        return item;
      } catch (error) {
        console.error("Error creating token cache:", error);
      }
    },
    saveToken: async (key: string, token: string) => {
      return await SecureStore.setItemAsync(key, token);
    },
  };
};

export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
