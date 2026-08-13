import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppColors } from "@/components/ui";

type IconName = keyof typeof Ionicons.glyphMap;

const icons: Record<
  string,
  {
    inactive: IconName;
    active: IconName;
  }
> = {
  index: {
    inactive: "home-outline",
    active: "home",
  },

  steps: {
    inactive: "footsteps-outline",
    active: "footsteps",
  },

  calories: {
    inactive: "flame-outline",
    active: "flame",
  },

  water: {
    inactive: "water-outline",
    active: "water",
  },

  profile: {
    inactive: "person-outline",
    active: "person",
  },
};

const visibleTabs = [
  "index",
  "steps",
  "calories",
  "water",
  "profile",
];

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <MinimalTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      {/* Steps */}
      <Tabs.Screen
        name="steps"
        options={{
          title: "Steps",
        }}
      />

      {/* Calories */}
      <Tabs.Screen
        name="calories"
        options={{
          title: "Calories",
        }}
      />

      {/* Water */}
      <Tabs.Screen
        name="water"
        options={{
          title: "Water",
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />

      {/* Statistics stays available but is NOT shown in footer */}
      <Tabs.Screen
        name="statistics"
        options={{
          href: null,
        }}
      />

      {/* Settings stays available but is NOT shown in footer */}
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

function MinimalTabBar({ state, navigation }: any) {
  const c = useAppColors();
  const insets = useSafeAreaInsets();

  const bottomSpace = Math.max(insets.bottom, 8);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          paddingBottom: bottomSpace + 6,
        },
      ]}
    >
      <BlurView
        intensity={75}
        tint="dark"
        style={[
          styles.blurBar,
          {
            borderColor: `${c.primary}35`,
          },
        ]}
      >
        {/* Subtle green glass overlay */}
        <View
          pointerEvents="none"
          style={[
            styles.greenOverlay,
            {
              backgroundColor: `${c.primary}18`,
            },
          ]}
        />

        {visibleTabs.map((routeName) => {
          const route = state.routes.find(
            (item: { name: string }) => item.name === routeName
          );

          if (!route) {
            return null;
          }

          const focused =
            state.index === state.routes.indexOf(route);

          const icon = icons[routeName];

          if (!icon) {
            return null;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(routeName);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={routeName}
              accessibilityRole="button"
              accessibilityState={{
                selected: focused,
              }}
              accessibilityLabel={routeName}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tabButton,
                {
                  opacity: pressed ? 0.55 : 1,
                },
              ]}
            >
              {/* Icon background */}
              <View
                style={[
                  styles.iconCircle,
                  focused && {
                    backgroundColor: `${c.primary}28`,
                    borderColor: `${c.primary}45`,
                  },
                ]}
              >
                <Ionicons
                  name={focused ? icon.active : icon.inactive}
                  size={21}
                  color={focused ? c.primary : c.muted}
                />
              </View>

              {/* Active indicator */}
              {focused && (
                <View
                  style={[
                    styles.activeDot,
                    {
                      backgroundColor: c.primary,
                    },
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: "center",

    paddingTop: 8,
  },

  blurBar: {
    width: "90%",
    height: 58,

    borderRadius: 29,

    overflow: "hidden",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    borderWidth: 1,
  },

  greenOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  tabButton: {
    width: 52,
    height: 52,

    alignItems: "center",
    justifyContent: "center",
  },

  iconCircle: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "transparent",
  },

  activeDot: {
    position: "absolute",

    bottom: 1,

    width: 4,
    height: 4,

    borderRadius: 2,
  },
});