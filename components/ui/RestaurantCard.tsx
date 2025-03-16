import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Restaurant } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";

cssInterop(Image, { className: "style" });

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  // console.log(restaurant);

  return (
    <View className="flex-1 flex-row w-full p-4 border-b-2 border-white gap-4">
      <Image className="h-[75] w-[75] rounded-lg" source={restaurant.img} />
      <View>
        <ThemedText type="subtitle">
          {restaurant.name} {restaurant.halal_info.fully_halal ? "🟢" : "🔴"}
        </ThemedText>
        <ThemedText>{`⭐️ ${restaurant.google_rating} (${restaurant.google_rating_count})`}</ThemedText>
        <ThemedText>{`❤️ by 0 friends`}</ThemedText>
        <ThemedText>{restaurant.cuisines.join(" • ")}</ThemedText>
      </View>
    </View>
  );
}
