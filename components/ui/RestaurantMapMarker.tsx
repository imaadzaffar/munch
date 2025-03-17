import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Restaurant } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCuisineEmoji } from "@/lib/utils";

export default function RestaurantMapMarker({
  restaurant,
  type = "default",
}: {
  restaurant: Restaurant;
  type: string;
}) {
  const bgColors = {
    saved: "bg-yellow-300",
    default: "bg-white",
    been: "bg-green-300",
  };

  return (
    <View
      className={
        `flex-1 flex-row items-center rounded-full py-1 px-2 border-2 border-stone-400 gap-1 ` + bgColors[type]
      }
    >
      {/* <FontAwesome6 name="utensils" size={12} color="orange" /> */}
      <View>
        <Text className="text-sm font-bold">
          {getCuisineEmoji(restaurant.cuisines[0])} {restaurant.google_rating.toFixed(1)}
        </Text>
      </View>
    </View>
  );
}
