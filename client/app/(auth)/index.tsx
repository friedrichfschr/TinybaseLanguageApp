import React from "react";
import * as Haptics from "expo-haptics";
import { useRouter, Href } from "expo-router";
import { Platform } from "react-native";
import {
  isClerkAPIResponseError,
  useOAuth,
  useSignIn,
  useSSO,
} from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import * as AuthSession from "expo-auth-session";
import { ClerkAPIError } from "@clerk/types";
import Landing from "@/components/Landing";
import { ScrollView } from "react-native";
import * as Crypto from "expo-crypto";

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  useWarmUpBrowser();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { signIn, isLoaded: isSignInLoaded, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();

  const router = useRouter();
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  const handleSignInWithGoogle = React.useCallback(async () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      // Start the authentication process
      const { createdSessionId, setActive } = await startGoogleOAuthFlow({
        redirectUrl: AuthSession.makeRedirectUri({ path: "(auth)" }),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(index)/(collections)/decks");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error("Google Sign In Error:", JSON.stringify(err, null, 2));
    }
  }, [startGoogleOAuthFlow, router]);

  const handleSignInWithApple = React.useCallback(async () => {
    if (!isSignInLoaded) {
      console.log("Sign in not loaded");
      return;
    }

    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    startSSOFlow({
      strategy: "oauth_apple",
      redirectUrl: AuthSession.makeRedirectUri({ path: "(auth)" }),
    })
      .then(async ({ createdSessionId }) => {
        if (createdSessionId) {
          setActive!({ session: createdSessionId });
          router.replace("/(index)/(collections)/decks");
        }
      })
      .catch((err) => {
        if (isClerkAPIResponseError(err)) setErrors(err.errors);
        console.error("Apple Sign In Error:", JSON.stringify(err, null, 2));
      });
  }, [isSignInLoaded, signIn, router]);

  const onNavigatePress = React.useCallback(
    (href: string) => {
      if (process.env.EXPO_OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      router.push(href as Href);
    },
    [router]
  );

  return Platform.OS === "web" ? (
    <ScrollView>
      <Landing
        onGoogleSignIn={handleSignInWithGoogle}
        onAppleSignIn={handleSignInWithApple}
        onEmailSignIn={() => onNavigatePress("/sign-in-email")}
        onPrivacyPolicy={() => onNavigatePress("/privacy-policy")}
      />
    </ScrollView>
  ) : (
    <Landing
      onGoogleSignIn={handleSignInWithGoogle}
      onAppleSignIn={handleSignInWithApple}
      onEmailSignIn={() => onNavigatePress("/sign-in-email")}
      onPrivacyPolicy={() => onNavigatePress("/privacy-policy")}
    />
  );
}
