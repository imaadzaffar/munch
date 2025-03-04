import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getAllRestaurants, getAllUsers } from "@/lib/firebase";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  getAllRestaurants();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Home</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
