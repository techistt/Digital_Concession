import { useLocalSearchParams, router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function SuccessScreen() {
  const { id } = useLocalSearchParams();
  const appId = Array.isArray(id) ? id[0] : id;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (appId) {
      AsyncStorage.setItem("savedAppId", appId).catch(console.error);
    }
  }, [appId]);

  const copyToClipboard = async () => {
    if (appId) {
      await Clipboard.setStringAsync(appId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Application Submitted!</Text>

        <Text style={styles.message}>
          Your bus concession application has been submitted successfully.
        </Text>

        <Text style={styles.info}>
          Your Application ID is below. It has been automatically saved to this
          device so you can view your digital pass easily!
        </Text>

        {appId && (
          <Pressable style={styles.idBox} onPress={copyToClipboard}>
            <Text style={styles.idLabel}>Application ID</Text>
            <Text style={styles.idText}>{appId}</Text>
            <Text style={styles.copyText}>
              {copied ? "Copied!" : "Tap to Copy"}
            </Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
      </View>
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

  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DFF7E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  check: {
    fontSize: 58,
    color: "#20A05A",
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#172B4D",
    textAlign: "center",
    marginBottom: 16,
  },

  message: {
    fontSize: 17,
    lineHeight: 25,
    color: "#475467",
    textAlign: "center",
    marginBottom: 16,
  },

  info: {
    fontSize: 14,
    lineHeight: 21,
    color: "#667085",
    textAlign: "center",
    marginBottom: 20,
  },

  idBox: {
    backgroundColor: "#F0F4FA",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 35,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderStyle: "dashed",
  },

  idLabel: {
    fontSize: 12,
    color: "#667085",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 6,
  },

  idText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 8,
  },

  copyText: {
    fontSize: 14,
    color: "#208AEF",
    fontWeight: "600",
  },

  button: {
    width: "100%",
    maxWidth: 360,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#208AEF",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
