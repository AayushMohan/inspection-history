import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={26} color="#11181C" />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.rightSpacer} />
      </View>

      <View style={styles.container}>
        <Text style={styles.bodyText}>No notifications</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
  },
  rightSpacer: {
    width: 26,
    height: 26,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
});
