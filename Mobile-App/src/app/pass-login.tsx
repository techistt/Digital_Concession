import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function PassLoginScreen() {
  const [appId, setAppId] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("savedAppId")
      .then((savedId) => {
        if (savedId) {
          router.replace(`/digital-pass?id=${savedId}` as any);
        }
      })
      .catch(console.error);
  }, []);

  const handleLogin = async () => {
    if (!appId.trim()) return;
    try {
      await AsyncStorage.setItem("savedAppId", appId.trim());
      router.push(`/digital-pass?id=${appId.trim()}` as any);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Digital Pass</Text>
        <Text style={styles.subtitle}>
          Enter your Application ID to view your approved Digital Bus Pass.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Application ID</Text>
          <TextInput
            style={styles.input}
            value={appId}
            onChangeText={setAppId}
            placeholder="e.g. 6aac28dbfe1..."
            placeholderTextColor="#98A2B3"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            !appId.trim() && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!appId.trim()}
        >
          <Text style={styles.buttonText}>View Pass</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </Pressable>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#667085",
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: "#101828",
  },
  button: {
    height: 56,
    backgroundColor: "#208AEF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#B0D3F8",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  backButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#667085",
    fontSize: 16,
    fontWeight: "600",
  },
});
