import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DigitalPassScreen() {
  const { id } = useLocalSearchParams();
  const appId = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const debuggerHost = Constants.expoConfig?.hostUri;
        const localhost = debuggerHost?.split(":")[0] || "localhost";
        const apiUrl = `http://${localhost}:5000/api/applications/${appId}`;

        const response = await axios.get(apiUrl);
        if (response.data.success) {
          setApplication(response.data.application);
        } else {
          setError("Failed to fetch pass data.");
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(
          `Error: ${err.response?.data?.message || err.message || "Network error"}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("savedAppId");
      router.replace("/");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
        <Text style={styles.loadingText}>Fetching your digital pass...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (application?.status !== "approved") {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Your application is currently: {application?.status}
        </Text>
        <Text style={styles.infoText}>
          QR code will be available once approved by the authorities.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.closeText}>✕ Close</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Student Pass</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.orgText}>Government of Kerala</Text>
          <Text style={styles.passTitle}>DIGITAL CONCESSION PASS</Text>

          <View style={styles.studentInfo}>
            <Text style={styles.name}>{application.fullName}</Text>
            <Text style={styles.detail}>ID: {application.studentId}</Text>
            <Text style={styles.detail}>
              Inst: {application.institutionName}
            </Text>
            <Text style={styles.detail}>
              Route: {application.travelFrom} to {application.travelTo}
            </Text>
          </View>

          <View style={styles.qrContainer}>
            {application.qrToken ? (
              <QRCode
                value={application.qrToken}
                size={200}
                color="black"
                backgroundColor="white"
              />
            ) : (
              <Text style={styles.errorText}>QR Token missing</Text>
            )}
          </View>

          <Text style={styles.footerText}>
            Show this QR code to the bus conductor for verification.
          </Text>

          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Remove Saved Pass</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#172B4D", // Dark background for contrast
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F9FF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#344054",
  },
  errorText: {
    fontSize: 18,
    color: "#D92D20",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#667085",
    textAlign: "center",
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  orgText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#667085",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  passTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#172B4D",
    marginBottom: 24,
  },
  studentInfo: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#475467",
    marginBottom: 2,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E4E7EC",
    marginBottom: 24,
  },
  footerText: {
    fontSize: 13,
    color: "#98A2B3",
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#208AEF",
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: "#D92D20",
    fontWeight: "600",
    fontSize: 14,
  },
});
