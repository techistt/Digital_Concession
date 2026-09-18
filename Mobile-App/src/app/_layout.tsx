import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />

      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Digital Bus Concession",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="application"
          options={{
            title: "Bus Concession Application",
            headerBackTitle: "Back",
          }}
        />

        <Stack.Screen
          name="success"
          options={{
            title: "Application Submitted",
            headerBackVisible: false,
          }}
        />
      </Stack>
    </>
  );
}
