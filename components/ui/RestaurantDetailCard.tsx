import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { Restaurant } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { cssInterop } from "nativewind";
import HalalIcon from "@/components/ui/HalalIcon";
import { Button, Chip, Divider, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import { addBeenRestaurant, addSavedRestaurant, removeSavedRestaurant, updateSavedRestaurant } from "@/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

cssInterop(Image, { className: "style" });
cssInterop(ThemedText, { className: "style" });

export default function RestaurantDetailCard({
  restaurant,
  savedType = "none",
}: {
  restaurant: Restaurant;
  savedType?: string;
}) {
  const router = useRouter();
  const USER_ID = "92214d35-7ed0-4f51-a131-afb9fa3c80f1";

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [type, setType] = useState(savedType);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const timestampToDate = timestamp => {
    const milliseconds = timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6;
    const date = new Date(milliseconds);
    return date.toDateString();
  };

  const saveIcons = {
    none: { icon: "plus-circle", color: "gray" },
    been: { icon: "check", color: "green" },
    saved: { icon: "bookmark", color: "orange" },
  };

  return (
    <View className="w-full p-4 border-b-2 border-white">
      <View className="flex-row justify-between">
        <ThemedText className="text-3xl font-bold mb-2">{restaurant.name}</ThemedText>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            // <Button onPress={openMenu}>Hello</Button>
            <TouchableOpacity onPress={openMenu}>
              <FontAwesome name={saveIcons[type].icon} size={24} color={saveIcons[type].color} />
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => {
              type === "none"
                ? addSavedRestaurant(USER_ID, restaurant.id)
                : updateSavedRestaurant(USER_ID, restaurant.id, "saved");
              setType("saved");
              closeMenu();
            }}
            title="Save"
          />
          <Menu.Item
            onPress={() => {
              type === "none"
                ? addBeenRestaurant(USER_ID, restaurant.id)
                : updateSavedRestaurant(USER_ID, restaurant.id, "been");
              setType("been");
              closeMenu();
            }}
            title="Been"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              removeSavedRestaurant(USER_ID, restaurant.id);
              setType("none");
              closeMenu();
            }}
            title="Remove"
          />
        </Menu>
      </View>
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
        <ThemedText className="mt-2 font-bold">
          {restaurant.avg_price ? `£${restaurant.avg_price.toFixed(2)}` : `£_`}
        </ThemedText>
        <ThemedText className="italic mb-2">{restaurant.description ? restaurant.description : `_`}</ThemedText>
        <Image className="h-[150] w-[150] rounded-lg mt-2" source={restaurant.img} />
        <View>
          <HalalIcon size={36} strokeWidth={2} color={restaurant.halal_info.fully_halal ? "green" : "orange"} />
          <ThemedText className="">Last verified: {timestampToDate(restaurant.halal_info.last_verified)}</ThemedText>
          <Button mode="contained-tonal" onPress={() => alert("Report halal status")}>
            Report
          </Button>
        </View>
      </View>
      <ThemedText className="mt-2">{restaurant.address}</ThemedText>
      <View className="flex-row gap-2 mt-2">
        {/* <Button mode="contained-tonal" onPress={() => Linking.openURL(restaurant.links.google_maps)}>
          Directions
        </Button> */}
        <Button mode="contained-tonal" onPress={() => addBeenRestaurant(USER_ID, restaurant.id)}>
          Been
        </Button>
        <Button mode="contained-tonal" onPress={() => addSavedRestaurant(USER_ID, restaurant.id)}>
          Save
        </Button>
        <Button mode="contained-tonal" onPress={() => router.push("/review")}>
          Review
        </Button>
      </View>
    </View>
  );
}
