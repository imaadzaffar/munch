import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import MapView, { Marker } from "react-native-maps";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  getAllRestaurants,
  getUserSavedRestaurants,
  getUserReviewedRestaurants,
  getNearbyRestaurants,
  getRestaurantsByName,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { Button, Searchbar } from "react-native-paper";

const keyExtractor = item => item.id;

export default function MapScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ref
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef({});
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // fetch
  const fetchRestaurants = async () => {
    const restaurants = await getAllRestaurants();
    setLoading(false);
    setRestaurants(restaurants);
  };

  const fetchRestaurantsByName = async () => {
    console.log("fetching for ", searchQuery);
    const restaurants = await getRestaurantsByName(searchQuery);
    setRestaurants(restaurants);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const onSubmitSearch = () => {
    console.log("submitted", searchQuery);
    bottomSheetModalRef.current?.dismiss();
    bottomSheetRef.current?.snapToIndex(1);

    if (searchQuery === "") {
      fetchRestaurants();
    } else {
      fetchRestaurantsByName();
    }
  };

  const resetRestaurantsSearch = () => {
    bottomSheetModalRef.current?.dismiss();
    bottomSheetRef.current?.snapToIndex(0);

    fetchRestaurants();
  };

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

  const restaurantResultsList = useMemo(() => {
    if (restaurants.length === 0) {
      return (
        <View>
          <Text>No restaurants found</Text>
          <Button>Request a new restaurant!</Button>
        </View>
      );
    }
    return <BottomSheetFlatList data={restaurants} keyExtractor={keyExtractor} renderItem={renderItem} />;
  }, [restaurants]);

  return (
    // <SafeAreaView>
    //   <View className="w-full items-center my-4">
    //     <ThemedText type="title">Explore</ThemedText>
    //   </View>
    // </SafeAreaView>
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        {!loading && (
          <>
            <View className="absolute top-[10] left-0 right-0 mx-2 z-10">
              <Searchbar
                placeholder="Search"
                onChangeText={setSearchQuery}
                value={searchQuery}
                onSubmitEditing={onSubmitSearch}
                onClearIconPress={resetRestaurantsSearch}
              />
            </View>
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
              {restaurantResultsList}
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
