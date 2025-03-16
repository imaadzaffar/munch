import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Restaurant } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import HalalIcon from "@/components/ui/HalalIcon";

cssInterop(Image, { className: "style" });

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  console.log(restaurant.name);

  return (
    <View className="flex-row w-full p-4 border-b-2 border-white gap-4">
      <Image className="h-[75] w-[75] rounded-lg" source={restaurant.img} />
      <View className="flex-1">
        <ThemedText type="subtitle">{restaurant.name}</ThemedText>
        <ThemedText>{`⭐️ ${restaurant.google_rating} (${restaurant.google_rating_count})`}</ThemedText>
        <ThemedText>{`❤️ by 0 friends`}</ThemedText>
        <ThemedText>{restaurant.cuisines.join(" • ")}</ThemedText>
      </View>
      <HalalIcon size={24} strokeWidth={2} color={restaurant.halal_info.fully_halal ? "green" : "red"} />
    </View>
  );
}
