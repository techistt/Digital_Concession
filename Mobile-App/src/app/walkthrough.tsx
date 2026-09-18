import { router } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const steps = [
  {
    title: "Apply Online",
    body: "Fill in your student, institution, address, and travel details from the application form.",
  },
  {
    title: "Upload Documents",
    body: "Attach your photo, student ID, Aadhaar card, institution approval form, and ration card.",
  },
  {
    title: "Track Your Pass",
    body: "Keep the application ID after submission. Once approved, it opens your digital pass.",
  },
  {
    title: "Show the QR Code",
    body: "Conductors can scan the QR code to verify your route and pass validity.",
  },
];

export default function WalkthroughScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>How Digital Concession Works</Text>
        <Text style={styles.subtitle}>
          A quick guide to applying and using your student bus pass.
        </Text>

        {steps.map((step, index) => (
          <View key={step.title} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}

        <Pressable style={styles.primaryButton} onPress={() => router.replace("/")}>
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.replace("/application")}>
          <Text style={styles.secondaryButtonText}>Start Application</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#667085",
    marginBottom: 28,
  },
  step: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#208AEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 4,
  },
  stepBody: {
    fontSize: 14,
    lineHeight: 21,
    color: "#667085",
  },
  primaryButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#208AEF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#E5F1FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#208AEF",
    fontSize: 16,
    fontWeight: "700",
  },
});
