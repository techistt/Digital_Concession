import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const WALKTHROUGH_KEY = "hasSeenWalkthroughPrompt";

export default function HomeScreen() {
  const [showWalkthroughPrompt, setShowWalkthroughPrompt] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(WALKTHROUGH_KEY)
      .then((value) => {
        if (!value) {
          setShowWalkthroughPrompt(true);
        }
      })
      .catch(console.error);
  }, []);

  const closeWalkthroughPrompt = async () => {
    await AsyncStorage.setItem(WALKTHROUGH_KEY, "true");
    setShowWalkthroughPrompt(false);
  };

  const openWalkthrough = async () => {
    await closeWalkthroughPrompt();
    router.push("/walkthrough" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🚌</Text>
        </View>

        <Text style={styles.title}>Digital Bus Concession</Text>

        <Text style={styles.subtitle}>
          Apply for your student bus concession online quickly and easily.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/application")}
        >
          <Text style={styles.buttonText}>Apply for Bus Concession</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/pass-login" as any)}
        >
          <Text style={styles.secondaryButtonText}>View Digital Pass</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.outlineButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/conductor" as any)}
        >
          <Text style={styles.outlineButtonText}>Conductor Scanner</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.linkButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/walkthrough" as any)}
        >
          <Text style={styles.linkButtonText}>App Walkthrough</Text>
        </Pressable>

        <Text style={styles.footer}>Student concession application portal</Text>
      </View>

      {showWalkthroughPrompt && (
        <View style={styles.promptOverlay}>
          <View style={styles.promptCard}>
            <Text style={styles.promptTitle}>Welcome</Text>
            <Text style={styles.promptText}>
              Take a quick walkthrough to see how to apply, view your pass, and
              scan QR codes.
            </Text>
            <Pressable style={styles.promptPrimary} onPress={openWalkthrough}>
              <Text style={styles.promptPrimaryText}>Go to Walkthrough</Text>
            </Pressable>
            <Pressable style={styles.promptSecondary} onPress={closeWalkthroughPrompt}>
              <Text style={styles.promptSecondaryText}>No Thanks</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E5F1FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  icon: {
    fontSize: 58,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#172B4D",
    textAlign: "center",
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#667085",
    textAlign: "center",
    maxWidth: 340,
    marginBottom: 38,
  },

  button: {
    width: "100%",
    maxWidth: 360,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#208AEF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  secondaryButton: {
    width: "100%",
    maxWidth: 360,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#E5F1FF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  secondaryButtonText: {
    color: "#208AEF",
    fontSize: 17,
    fontWeight: "600",
  },

  outlineButton: {
    width: "100%",
    maxWidth: 360,
    height: 58,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  linkButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
  },

  linkButtonText: {
    color: "#208AEF",
    fontSize: 16,
    fontWeight: "600",
  },

  outlineButtonText: {
    color: "#344054",
    fontSize: 17,
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 24,
    marginLeft: 12,
  },

  footer: {
    marginTop: 28,
    fontSize: 13,
    color: "#98A2B3",
  },

  promptOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(16, 24, 40, 0.48)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  promptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },

  promptTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 10,
  },

  promptText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#667085",
    marginBottom: 22,
  },

  promptPrimary: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#208AEF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  promptPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  promptSecondary: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  promptSecondaryText: {
    color: "#667085",
    fontSize: 15,
    fontWeight: "600",
  },
});
