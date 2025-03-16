import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Text } from "react-native";

export default function AccountScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center">
      <View className="flex-row justify-center gap-2">
        <Ionicons name="person-circle" size={24} color="black" />
        <ThemedText type="title">Account</ThemedText>
      </View>
    </ThemedView>
  );
}
