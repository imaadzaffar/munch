import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RestaurantCard from "@/components/ui/RestaurantCard";
import { getAllRestaurants } from "@/lib/supabase";
import { Restaurant } from "@/lib/types";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView } from "react-native";

export default function ExploreScreen() {
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    const allRestaurants = await getAllRestaurants();
    console.log(allRestaurants);
    setRestaurants(allRestaurants);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Explore</ThemedText>
      </View>
      <FlatList
        data={restaurants}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    alignItems: "center",
    marginVertical: 16,
  },
  container: {
    flex: 1,
    // marginBottom: 50,
  },
});
