import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Restaurant } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";

export default function RestaurantMapMarker({ restaurant }: { restaurant: Restaurant }) {
  console.log(restaurant);

  return (
    <View className="flex-1 flex-row items-center rounded-full py-1 px-2 border-2 border-stone-400 gap-1 bg-white">
      <FontAwesome6 name="utensils" size={12} color="orange" />
      <View>
        <Text className="text-sm font-bold">{restaurant.google_rating.toFixed(1)}</Text>
      </View>
    </View>
  );
}
