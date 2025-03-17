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
        <ThemedText className="text-sm">
          {`⭐️ ${restaurant.google_rating} (${restaurant.google_rating_count})`} {`❤️ 0 friends`}
        </ThemedText>
      </View>
      <Image className="h-[150] w-[150] rounded-lg" source={restaurant.img} />
      <HalalIcon size={24} strokeWidth={2} color={restaurant.halal_info.fully_halal ? "green" : "red"} />
      <Button>Get directions</Button>
      <Button>Save to wishlist</Button>
      <Button>Add review</Button>
    </View>
  );
}
