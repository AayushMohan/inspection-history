import { Tabs } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScanButtonProvider, useScanButton } from "./scan-button-context";

type TabPressHandler = PressableProps["onPress"];

const WEB_NO_OUTLINE_STYLE =
  Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null;

function ScanTabButton(props: { onPress?: TabPressHandler }) {
  const { collapsed } = useScanButton();

  const translateY = useRef(new Animated.Value(-14)).current;
  const scale = useRef(new Animated.Value(1.0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: collapsed ? 0 : -14,
        useNativeDriver: true,
        friction: 9,
        tension: 90,
      }),
      Animated.spring(scale, {
        toValue: collapsed ? 0.94 : 1.0,
        useNativeDriver: true,
        friction: 9,
        tension: 90,
      }),
    ]).start();
  }, [collapsed, scale, translateY]);

  const wrapperStyle = useMemo(
    () => ({ transform: [{ translateY }, { scale }] }),
    [scale, translateY]
  );

  return (
    <Animated.View style={wrapperStyle}>
      <Pressable
        accessibilityRole="button"
        // React Navigation's tabBarButton receives a handler that expects an event.
        // Pressable's `onPress` provides one, so we accept a variadic signature.
        onPress={props.onPress}
        style={({ pressed }) => [
          styles.scanButton,
          pressed ? styles.scanPressed : null,
        ]}
      >
        <Ionicons name="barcode-outline" size={40} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );
}

function DefaultTabButton(props: {
  children: React.ReactNode;
  onPress?: TabPressHandler;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      style={[props.style, WEB_NO_OUTLINE_STYLE]}
    >
      {props.children}
    </Pressable>
  );
}

function DisabledTabButton(props: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {}}
      style={[props.style, WEB_NO_OUTLINE_STYLE]}
    >
      {props.children}
    </Pressable>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarBottomInset = Math.max(0, insets.bottom - 6);

  return (
    <ScanButtonProvider>
      <View style={styles.root}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#11181C",
            tabBarInactiveTintColor: "#11181C",
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: [
              styles.tabBar,
              {
                height: styles.tabBar.height + tabBarBottomInset,
                paddingBottom: styles.tabBar.paddingBottom + tabBarBottomInset,
              },
            ],
            tabBarItemStyle: styles.tabBarItem,
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarLabel: "Home",
              tabBarIcon: ({ color }) => (
                <Ionicons name="home-outline" size={20} color={color} />
              ),
              tabBarButton: (props) => (
                <DefaultTabButton onPress={props.onPress} style={props.style}>
                  {props.children}
                </DefaultTabButton>
              ),
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: "Scan",
              tabBarLabel: "",
              tabBarIcon: ({ color }) => (
                <Ionicons name="scan-outline" size={24} color={color} />
              ),
              tabBarButton: (props) => (
                <ScanTabButton onPress={props.onPress} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarLabel: "Profile",
              tabBarIcon: ({ color }) => (
                <View style={styles.profileRing}>
                  <Ionicons name="person-outline" size={18} color={color} />
                </View>
              ),

              // Per request: keep it visible but disable navigation.
              tabBarButton: (props) => (
                <DisabledTabButton style={props.style}>
                  {props.children}
                </DisabledTabButton>
              ),
            }}
          />
        </Tabs>
      </View>
    </ScanButtonProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  tabBar: {
    height: 68,
    paddingBottom: 6,
    paddingTop: 6,

    backgroundColor: "#FFFFFF",
    overflow: "visible",

    borderTopWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 12,
    ...(Platform.OS === "web"
      ? ({ boxShadow: "0px -6px 18px rgba(0,0,0,0.08)" } as any)
      : null),
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 1,
  },
  profileRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  scanButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#6CA2F1",
    alignItems: "center",
    justifyContent: "center",
  },
  scanPressed: {
    opacity: 0.85,
  },
});
