import { SafeAreaView, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Redirect, router } from "expo-router";
import { useStoreValue } from "@/stores/UserStore";
import TextInput from "@/components/ui/text-input";
import { useStore, useStoreIds } from "tinybase/ui-react";
import { ThemedSafeAreaView } from "@/components/ThemedView";

type Props = {};

const index = (props: Props) => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [newEmail, setNewEmail] = React.useState("");
  const [storeEmail, setStoreEmail] = useStoreValue("email");

  const storeIds = useStoreIds();
  console.log("storeIds", storeIds);
  return (
    <ThemedSafeAreaView style={{ height: "100%" }}>
      <Button
        onPress={async () => {
          await signOut();
          router.replace("/(auth)");
        }}
        style={{ backgroundColor: "red" }}
      >
        <ThemedText>Sign out</ThemedText>
      </Button>

      <ThemedText
        style={{ borderColor: "red", borderWidth: 2, borderStyle: "solid" }}
      >
        {storeEmail}
      </ThemedText>
    </ThemedSafeAreaView>
  );
};

export default index;
