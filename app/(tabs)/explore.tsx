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

import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
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

  // ref
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef({});
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleMapMarkerPress = useCallback(
    selectedRestaurantId => {
      console.log("handleMapMarkerPress", selectedRestaurantId);

      const restaurant = restaurants.find(r => r.id === selectedRestaurantId);
      console.log("length", restaurants.length);
      console.log("found", restaurant);

      if (restaurant) {
        setSelectedRestaurant(restaurant);
        console.log("selected", selectedRestaurant);

        bottomSheetRef.current?.snapToIndex(0);
        bottomSheetModalRef.current?.present();

        markerRefs.current[selectedRestaurantId]?.showCallout();

        mapRef.current?.animateToRegion(
          {
            latitude: restaurant?.location_lat,
            longitude: restaurant?.location_long,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        ); // 1000ms animation duration
      } else {
        console.log("not found");
      }
    },
    [restaurants]
  );

  const fetchRestaurants = async () => {
    const restaurants = await getAllRestaurants();
    restaurants?.forEach(r => {
      console.log(r.id, r.name);
    });
    console.log("All restaurants", restaurants.length);
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

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            handleMapMarkerPress(item.id);
          }}
        >
          <RestaurantCard key={item.id} restaurant={item} />
        </TouchableOpacity>
      );
    },
    [handleMapMarkerPress]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        {restaurants.length > 0 && (
          <>
            <MapView
              ref={mapRef}
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
                  key={r.id}
                  identifier={r.id}
                  ref={ref => (markerRefs.current[r.id] = ref)}
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
            <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={["50%"]}>
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
