import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import CryptoJS from "crypto-js";

export default function ConductorScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<"pending" | "valid" | "invalid">(
    "pending",
  );
  const [studentData, setStudentData] = useState<any>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.backBtn]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    verifyQRCode(data);
  };

  const verifyQRCode = (qrString: string) => {
    try {
      // The qrToken is a JSON string containing { payload, signature }
      const parsedData = JSON.parse(qrString);

      if (!parsedData.payload || !parsedData.signature) {
        setScanResult("invalid");
        return;
      }

      // Verify HMAC-SHA256 signature
      const expectedSignature = CryptoJS.HmacSHA256(
        parsedData.payload,
        process.env.EXPO_PUBLIC_SECRET_KEY_CONDUCTOR || "default_secret",
      ).toString();

      if (expectedSignature === parsedData.signature) {
        const payloadData = JSON.parse(parsedData.payload);

        // Check expiry
        const expiryDate = new Date(payloadData.expiry);
        if (expiryDate < new Date()) {
          Alert.alert("Expired", "This concession pass has expired.");
          setScanResult("invalid");
          return;
        }

        setStudentData(payloadData);
        setScanResult("valid");
      } else {
        setScanResult("invalid");
      }
    } catch (error) {
      setScanResult("invalid");
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScanResult("pending");
    setStudentData(null);
  };

  if (scanResult === "valid") {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#039855" }]}>
        <View style={styles.resultContent}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✅</Text>
          </View>
          <Text style={styles.resultTitle}>VALID PASS</Text>

          <View style={styles.detailsCard}>
            <Text style={styles.detailLabel}>Student Name</Text>
            <Text style={styles.detailValue}>{studentData?.name}</Text>

            <Text style={styles.detailLabel}>Institution / Route</Text>
            <Text style={styles.detailValue}>{studentData?.route}</Text>

            <Text style={styles.detailLabel}>Valid Until</Text>
            <Text style={styles.detailValue}>
              {new Date(studentData?.expiry).toLocaleDateString()}
            </Text>
          </View>

          <Pressable style={styles.scanAgainButton} onPress={resetScanner}>
            <Text style={styles.scanAgainText}>Scan Next Pass</Text>
          </Pressable>
          <Pressable style={styles.exitButton} onPress={() => router.back()}>
            <Text style={styles.exitText}>Exit Scanner</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (scanResult === "invalid") {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: "#D92D20" }]}>
        <View style={styles.resultContent}>
          <View style={styles.iconCircleRed}>
            <Text style={styles.iconText}>❌</Text>
          </View>
          <Text style={styles.resultTitle}>INVALID OR FAKE PASS</Text>
          <Text style={styles.resultSubtitle}>
            This QR code could not be verified. It may be forged or tampered
            with.
          </Text>

          <Pressable style={styles.scanAgainButton} onPress={resetScanner}>
            <Text style={styles.scanAgainText}>Scan Next Pass</Text>
          </Pressable>
          <Pressable style={styles.exitButton} onPress={() => router.back()}>
            <Text style={styles.exitText}>Exit Scanner</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.closeText}>✕ Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Conductor Scanner</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanInstruction}>
            Position the student's QR code within the frame to scan.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F9FF",
  },
  message: {
    textAlign: "center",
    paddingBottom: 20,
    fontSize: 16,
    color: "#344054",
  },
  button: {
    backgroundColor: "#208AEF",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: "#667085",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#000000",
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
  cameraContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: "#00FF00",
    backgroundColor: "transparent",
    borderRadius: 16,
  },
  scanInstruction: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 40,
    textAlign: "center",
    paddingHorizontal: 30,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    borderRadius: 8,
  },
  resultContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1FADF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircleRed: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEE4E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconText: {
    fontSize: 40,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 32,
    letterSpacing: 1,
  },
  resultSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.9,
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
  },
  detailLabel: {
    fontSize: 13,
    color: "#667085",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    color: "#101828",
    fontWeight: "700",
    marginBottom: 20,
  },
  scanAgainButton: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scanAgainText: {
    color: "#101828",
    fontSize: 17,
    fontWeight: "700",
  },
  exitButton: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  exitText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
