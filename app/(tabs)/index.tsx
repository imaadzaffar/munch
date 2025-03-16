import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RestaurantCard from "@/components/ui/RestaurantCard";
import { getNearbyRestaurants } from "@/lib/supabase";
import { Restaurant } from "@/lib/types";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, SafeAreaView } from "react-native";

import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  const fetchNearbyRestaurants = async () => {
    // console.log(location?.coords?.latitude);
    // console.log(location?.coords?.longitude);
    const nearbyRestaurants = await getNearbyRestaurants(location?.coords?.longitude, location?.coords?.latitude);
    console.log("Nearby restaurants", nearbyRestaurants.length);
    setRestaurants(nearbyRestaurants);
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      console.log("hello");
      // fetchNearbyRestaurants();
    }
  }, [location]);

  return (
    <ThemedView className="flex-1 items-center justify-center">
      <View className="flex-row justify-center gap-2">
        <Ionicons name="home" size={24} color="black" />
        <ThemedText type="title">Home</ThemedText>
      </View>
    </ThemedView>
    // <SafeAreaView>
    //   <View className="w-full items-center my-4">
    //     <ThemedText type="title">Explore</ThemedText>
    //   </View>
    //   (errorMsg ?<ThemedText>{errorMsg}</ThemedText> :<ThemedText>{JSON.stringify(location)}</ThemedText>
    //   <FlatList
    //     data={restaurants}
    //     renderItem={({ item }) => (
    //       <View>
    //         <ThemedText>{item.dist_meters}m away</ThemedText>
    //         <RestaurantCard restaurant={{ halal_info: { fully_halal: true }, cuisines: [], ...item }} />
    //       </View>
    //     )}
    //   />
    //   )
    // </SafeAreaView>
  );
}
