import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Restaurant } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  // console.log(restaurant);

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={restaurant.img} />
      <View>
        <ThemedText type="subtitle">{restaurant.name}</ThemedText>
        <ThemedText>{`${restaurant.google_rating} (${restaurant.google_rating_count})`}</ThemedText>
        <ThemedText>{`Fully Halal: ${restaurant.halal_info.fully_halal}`}</ThemedText>
        <ThemedText>{restaurant.cuisines.join(",")}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: "white",
    gap: 16,
  },
  img: {
    height: 75,
    width: 75,
    borderRadius: 8,
  },
});
