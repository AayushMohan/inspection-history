import dayjs from "dayjs";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getInspectionsByMonth, inspectionData } from "@/mockData";
import { useScanButton } from "./scan-button-context";

type InspectionStatus = "Satisfactory" | "Pending" | "Failed";

type InspectionItem = {
  date: string;
  taskName: string;
  taskDescription: string;
  status: InspectionStatus;
};

type InspectionSection = {
  title: string;
  dateKey: string;
  data: InspectionItem[];
};

type StatusStyle = {
  bg: string;
  text: string;
  strip: string;
};

const STATUS_STYLES: Record<InspectionStatus, StatusStyle> = {
  Satisfactory: {
    bg: "#C8E6C9",
    text: "#388E3C",
    strip: "#388E3C",
  },
  Pending: {
    bg: "#FFE0B2",
    text: "#F57C00",
    strip: "#F57C00",
  },
  Failed: {
    bg: "#FFCDD2",
    text: "#D32F2F",
    strip: "#D32F2F",
  },
};

function buildInspectionSections(
  inspections: InspectionItem[]
): InspectionSection[] {
  const byDate = new Map<string, InspectionItem[]>();
  for (const item of inspections) {
    const dateKey = dayjs(item.date).format("YYYY-MM-DD");
    const list = byDate.get(dateKey);
    if (list) list.push(item);
    else byDate.set(dateKey, [item]);
  }

  const sortedKeys = [...byDate.keys()].sort(
    (a, b) => dayjs(b).valueOf() - dayjs(a).valueOf()
  );

  return sortedKeys.map((dateKey) => {
    const d = dayjs(dateKey);
    return {
      dateKey,
      title: d.format("ddd, MMM D, YYYY"),
      data: byDate.get(dateKey) ?? [],
    };
  });
}

function AnimatedListRow({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enter.stopAnimation();
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      duration: 220,
      delay: Math.min(index, 10) * 35,
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  return (
    <Animated.View
      style={{
        opacity: enter,
        transform: [
          {
            translateY: enter.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

function getLatestInspectionMonth() {
  const fallback = dayjs();
  const latest = inspectionData.inspections.reduce(
    (acc, item) => {
      const d = dayjs(item.date);
      return d.isAfter(acc) ? d : acc;
    },
    inspectionData.inspections[0]?.date
      ? dayjs(inspectionData.inspections[0].date)
      : fallback
  );

  return latest.startOf("month");
}

export default function InspectionHistoryScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? "light"].tint;
  const today = dayjs();

  const { setCollapsed } = useScanButton();
  const lastCollapsed = useRef<boolean>(false);

  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() =>
    getLatestInspectionMonth()
  );

  const onPrevMonth = useCallback(() => {
    setSelectedMonth((m) => m.subtract(1, "month").startOf("month"));
  }, []);
  const onNextMonth = useCallback(() => {
    setSelectedMonth((m) => m.add(1, "month").startOf("month"));
  }, []);

  const monthLabel = selectedMonth.format("MMMM YYYY");

  const inspections: InspectionItem[] = useMemo(() => {
    const filtered = getInspectionsByMonth(
      selectedMonth.year(),
      selectedMonth.month() + 1
    ) as InspectionItem[];
    return [...filtered].sort(
      (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
    );
  }, [selectedMonth]);

  const sections: InspectionSection[] = useMemo(() => {
    return buildInspectionSections(inspections);
  }, [inspections]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(() => setRefreshing(false), 600);
  }, []);

  useEffect(() => {
    // Default state when entering the screen: popped-up scan button.
    setCollapsed(false);
    lastCollapsed.current = false;
  }, [setCollapsed]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, []);

  const onListScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const nextCollapsed = y > 8;
      if (nextCollapsed !== lastCollapsed.current) {
        lastCollapsed.current = nextCollapsed;
        setCollapsed(nextCollapsed);
      }
    },
    [setCollapsed]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: InspectionSection }) => (
      <View style={styles.stickyHeader}>
        <Text style={styles.stickyHeaderText}>{section.title}</Text>
      </View>
    ),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: InspectionItem; index: number }) => {
      const d = dayjs(item.date);
      const dayNumber = d.format("D");
      const isToday = d.isSame(today, "day");
      const statusStyle = STATUS_STYLES[item.status];

      return (
        <AnimatedListRow index={index}>
          <View style={styles.rowWrap}>
            <View style={styles.timelineCol}>
              <Text style={styles.dateText}>{dayNumber}</Text>
              <View style={styles.timelineLine} />
            </View>

            <View style={styles.timelineConnectorWrap}>
              <View style={styles.timelineConnector} />
            </View>

            <View
              style={[
                styles.card,
                { backgroundColor: statusStyle.bg },
                isToday ? { borderColor: tint, borderWidth: 2 } : null,
              ]}
            >
              <View
                style={[
                  styles.statusStrip,
                  { backgroundColor: statusStyle.strip },
                ]}
              />
              <View style={styles.cardBody}>
                <View style={styles.cardTextArea}>
                  <Text style={styles.taskName} numberOfLines={1}>
                    {item.taskName}
                  </Text>
                  <Text style={styles.taskDesc} numberOfLines={1}>
                    {item.taskDescription}
                  </Text>
                </View>
                <View style={styles.cardDivider} />
                <View style={styles.statusCol}>
                  <Text
                    style={[styles.statusText, { color: statusStyle.text }]}
                    numberOfLines={1}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedListRow>
      );
    },
    [tint, today]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable accessibilityRole="button" onPress={() => {}} hitSlop={10}>
            <Ionicons name="arrow-back" size={26} color="#11181C" />
          </Pressable>

          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Pressable accessibilityRole="button" onPress={() => {}} hitSlop={10}>
            <Ionicons name="notifications-outline" size={26} color="#11181C" />
          </Pressable>
        </View>

        <Text style={styles.screenTitle}>Inspection History</Text>

        <View style={styles.equipmentCard}>
          <View style={styles.equipmentPill}>
            <Text style={styles.equipmentName}>
              {inspectionData.equipment.name}
            </Text>
          </View>
          <View style={styles.equipmentMeta}>
            <Text style={styles.equipmentMetaText} numberOfLines={1}>
              ID : {inspectionData.equipment.id}
            </Text>
            <Text style={styles.equipmentMetaText} numberOfLines={1}>
              Tag : {inspectionData.equipment.tag}
            </Text>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Inspections</Text>

          <View style={styles.monthNav}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              onPress={onPrevMonth}
              hitSlop={10}
            >
              <Ionicons name="chevron-back" size={18} color="#11181C" />
            </Pressable>

            <Text style={styles.monthLabel}>in {monthLabel}</Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next month"
              onPress={onNextMonth}
              hitSlop={10}
            >
              <Ionicons name="chevron-forward" size={18} color="#11181C" />
            </Pressable>
          </View>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item, idx) => `${item.date}-${item.status}-${idx}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          onScroll={onListScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },
  headerRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  logo: {
    width: 42,
    height: 42,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 20,
    color: "#11181C",
  },
  equipmentCard: {
    backgroundColor: "#6CA2F1",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  equipmentPill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  equipmentName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
  },
  equipmentMeta: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 28,
  },
  equipmentMetaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 24,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "500",
    color: "#2E2E30",
    marginTop: 10,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2E2E30",
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listContent: {
    paddingTop: 6,
    paddingBottom: 16,
  },
  stickyHeader: {
    backgroundColor: "#FFFFFF",
    paddingTop: 4,
    paddingBottom: 10,
  },
  stickyHeaderText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#11181C",
    paddingLeft: 64 + 18,
    paddingRight: 14,
  },
  rowWrap: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
    minWidth: 26,
    textAlign: "right",
  },
  timelineCol: {
    width: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  timelineLine: {
    alignSelf: "stretch",
    width: 2,
    backgroundColor: "#D0D0D0",
    borderRadius: 2,
    marginLeft: 12,
  },
  timelineConnectorWrap: {
    width: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineConnector: {
    height: 1,
    width: 18,
    backgroundColor: "#D0D0D0",
  },
  card: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 0,
  },
  statusStrip: {
    position: "absolute",
    left: 12,
    top: 10,
    bottom: 10,
    width: 5,
    borderRadius: 6,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 28,
    paddingRight: 14,
    paddingVertical: 12,
  },
  cardTextArea: {
    flex: 1,
    paddingRight: 12,
  },
  taskName: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: "#11181C",
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: -0.1,
    color: "#6B7280",
  },
  cardDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(0,0,0,0.25)",
    marginHorizontal: 8,
  },
  statusCol: {
    width: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.1,
    textAlign: "center",
  },
});
