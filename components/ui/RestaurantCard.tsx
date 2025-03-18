import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Restaurant } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import HalalIcon from "@/components/ui/HalalIcon";
import { Chip } from "react-native-paper";

cssInterop(Image, { className: "style" });
cssInterop(ThemedText, { className: "style" });

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <View className="flex-row w-full p-4 border-b-2 border-white gap-4">
      <Image className="h-[75] w-[75] rounded-lg" source={restaurant.img} />
      <View className="flex-1">
        <ThemedText className="font-bold">{restaurant.name}</ThemedText>
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
        <ThemedText className="text-sm font-medium">
          {`⭐️ ${restaurant.google_rating} (${restaurant.google_rating_count})`} {`❤️ 0 friends`}
        </ThemedText>
        <ThemedText className="text-sm">
          {restaurant.avg_price ? `£${restaurant.avg_price.toFixed(2)}` : `£_`}
        </ThemedText>
      </View>
      <HalalIcon size={24} strokeWidth={2} color={restaurant.halal_info.fully_halal ? "green" : "orange"} />
    </View>
  );
}
