import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import MapView, { Marker } from "react-native-maps";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  getAllRestaurants,
  getUserSavedRestaurants,
  getUserReviewedRestaurants,
  getNearbyRestaurants,
} from "@/lib/supabase";
import { Restaurant } from "@/lib/types";
import RestaurantMapMarker from "@/components/ui/RestaurantMapMarker";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetFlashList,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import RestaurantCard from "@/components/ui/RestaurantCard";

const keyExtractor = item => item.id;

export default function MapScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  // const [visited, setVisited] = useState([]);
  // const [saved, setSaved] = useState([]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleMapMarkerPress = selectedRestaurantId => {
    console.log("handleMapMarkerPress", selectedRestaurantId);
    const restaurant = restaurants.find(r => r.id === selectedRestaurantId);
    // console.log("found", restaurant);
    setSelectedRestaurant(restaurant);
    // console.log("selected", selectedRestaurant);
    bottomSheetModalRef.current?.present();
  };
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const fetchRestaurants = async () => {
    let restaurants = [];

    const allRestaurants = await getAllRestaurants();
    // console.log(allRestaurants);
    // setRestaurants(allRestaurants);
    if (allRestaurants) {
      const tmp = allRestaurants.map(r => {
        return { type: "all", ...r };
      });
      // console.log(tmp);
      restaurants = [...tmp];
    }
    console.log("All restaurants", restaurants.length);

    // const userId = "NK5hqbtMQvcTRISmZjQaVVhACBH2";

    // const savedIds = await getUserSavedRestaurants(userId);
    // console.log(restaurants.length);
    // setSaved(savedRestaurants);

    // const reviewedIds = await getUserReviewedRestaurants(userId);
    // console.log(restaurants.length);
    // setVisited(visitedRestaurants);

    // const nearbyRestaurants = await getNearbyRestaurants(51, -0.1, 10);
    // console.log(nearbyRestaurants);

    // console.log(restaurants);
    setRestaurants(restaurants);
  };

  useEffect(() => {
    fetchRestaurants();
    // sheetRef.current?.present();
  }, []);

  const pinColors = {
    all: "red",
    saved: "yellow",
    visited: "blue",
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <Pressable
        onPress={() => {
          handleMapMarkerPress(item.id);
        }}
      >
        <RestaurantCard key={item.id} restaurant={item} />
      </Pressable>
    );
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        {restaurants.length > 0 && (
          <>
            <MapView
              key={restaurants.length}
              // provider="google"
              style={styles.map}
              initialRegion={{
                latitude: 51.505,
                longitude: 0.0,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              }}
              showsUserLocation={true}
            >
              {restaurants.map((r, index) => (
                <Marker
                  identifier={r.id}
                  key={r.id}
                  coordinate={{
                    latitude: r.location_lat,
                    longitude: r.location_long,
                  }}
                  title={r.name}
                  // description={r.cuisines.join(",")}
                  // pinColor={pinColors[r.type]}
                  onPress={e => handleMapMarkerPress(e.nativeEvent.id)}
                >
                  <RestaurantMapMarker restaurant={r} />
                  {/* <Text>{r.name}</Text> */}
                </Marker>
              ))}
            </MapView>
            <BottomSheet
              ref={bottomSheetRef}
              // index={0}
              snapPoints={["15%", "60%", "90%"]}
              enableDynamicSizing={false}
              onChange={handleSheetChanges}
            >
              <Text className="ml-4 text-2xl font-bold">Restaurants</Text>
              <BottomSheetFlatList data={restaurants} keyExtractor={keyExtractor} renderItem={renderItem} />
              {/* <BottomSheetFlashList
                  data={restaurants}
                  keyExtractor={keyExtractor}
                  renderItem={renderItem}
                  estimatedItemSize={100}
                /> */}
            </BottomSheet>
            <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={["50%"]} onChange={handleSheetChanges}>
              <BottomSheetView>
                <RestaurantCard restaurant={selectedRestaurant} />
              </BottomSheetView>
            </BottomSheetModal>
          </>
        )}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   padding: 24,
  //   justifyContent: "center",
  //   backgroundColor: "grey",
  // },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 10,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
