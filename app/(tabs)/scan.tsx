import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CameraView, useCameraPermissions } from "expo-camera";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastValue, setLastValue] = useState<string | null>(null);

  const permissionState = permission?.status;
  const hasPermission = permissionState === "granted";

  const helpText = useMemo(() => {
    if (!permissionState) return "Checking camera permission…";
    if (permissionState === "denied") return "Camera permission is denied.";
    if (permissionState === "undetermined")
      return "Camera permission is required.";
    return null;
  }, [permissionState]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerRow}>
        <View style={styles.headerSide} />
        <Text style={styles.title}>Scan</Text>
        <View style={styles.headerSide} />
      </View>

      <View style={styles.container}>
        {!hasPermission ? (
          <View style={styles.permissionCard}>
            <Ionicons name="camera" size={34} color="#11181C" />
            <Text style={styles.permissionTitle}>Enable Camera</Text>
            {helpText ? (
              <Text style={styles.permissionText}>{helpText}</Text>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={() => requestPermission()}
              style={styles.permissionButton}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cameraWrap}>
            <CameraView
              style={StyleSheet.absoluteFill}
              barcodeScannerSettings={{
                barcodeTypes: [
                  "qr",
                  "ean13",
                  "ean8",
                  "code128",
                  "code39",
                  "code93",
                  "upc_a",
                  "upc_e",
                  "pdf417",
                  "aztec",
                  "datamatrix",
                ],
              }}
              onBarcodeScanned={(result) => {
                if (scanned) return;
                setScanned(true);
                setLastValue(result.data ?? "");
              }}
            />

            <View pointerEvents="none" style={styles.overlay}>
              <View style={styles.frame} />
              <Text style={styles.overlayText}>
                Align barcode/QR inside the box
              </Text>
            </View>

            <View style={styles.bottomCard}>
              <Text style={styles.bottomTitle}>Last scanned</Text>
              <Text style={styles.bottomValue} numberOfLines={2}>
                {lastValue ? lastValue : "—"}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setScanned(false)}
                style={styles.scanAgainButton}
              >
                <Text style={styles.scanAgainText}>
                  {scanned ? "Scan again" : "Scanning…"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 6,
  },
  headerSide: {
    width: 26,
    height: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  permissionCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#11181C",
  },
  permissionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 320,
  },
  permissionButton: {
    marginTop: 8,
    backgroundColor: "#6CA2F1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  cameraWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 110,
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  overlayText: {
    marginTop: 14,
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomCard: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 12,
    padding: 12,
  },
  bottomTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#11181C",
    marginBottom: 6,
  },
  bottomValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 10,
  },
  scanAgainButton: {
    alignSelf: "flex-start",
    backgroundColor: "#6CA2F1",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  scanAgainText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
