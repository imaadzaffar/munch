import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Restaurant } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import HalalIcon from "@/components/ui/HalalIcon";
import { Button, Chip } from "react-native-paper";

cssInterop(Image, { className: "style" });
cssInterop(ThemedText, { className: "style" });

export default function RestaurantDetailCard({ restaurant }: { restaurant: Restaurant }) {
  console.log(restaurant.halal_info.last_verified);

  const timestampToDate = timestamp => {
    const milliseconds = timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6;
    const date = new Date(milliseconds);
    return date.toDateString();
  };

  return (
    <View className="w-full p-4 border-b-2 border-white gap-4">
      <ThemedText className="text-3xl font-bold">{restaurant.name}</ThemedText>
      <View>
        <View className="flex-row gap-2">
          {restaurant.cuisines.map(item => (
            <Chip
              mode="flat"
              key={item}
              compact={true}
              style={{ borderRadius: 999 }}
              textStyle={{ fontSize: 12, marginHorizontal: 16, marginVertical: 4 }}
            >
              {item}
            </Chip>
          ))}
        </View>
        <ThemedText className="mt-2 font-bold">
          {`⭐️ ${restaurant.google_rating} (${restaurant.google_rating_count})`} {`❤️ 0 friends`}
        </ThemedText>
      </View>
      <Image className="h-[150] w-[150] rounded-lg" source={restaurant.img} />
      <View>
        <HalalIcon size={36} strokeWidth={2} color={restaurant.halal_info.fully_halal ? "green" : "red"} />
        <Text>Last verified: {timestampToDate(restaurant.halal_info.last_verified)}</Text>
      </View>
      <View className="flex-row gap-2">
        <Button mode="contained-tonal" onPress={() => alert("Get directions")}>
          Directions
        </Button>
        <Button mode="contained-tonal" onPress={() => alert("Save to wishlist")}>
          Save
        </Button>
        <Button mode="contained-tonal" onPress={() => alert("Add review")}>
          Review
        </Button>
      </View>
    </View>
  );
}
