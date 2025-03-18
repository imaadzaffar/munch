import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import MapView, { Marker } from "react-native-maps";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  getAllRestaurants,
  getUserSavedRestaurants,
  getUserReviewedRestaurants,
  getNearbyRestaurants,
  getRestaurantsByName,
  getRestaurantsByCuisines,
  getRestaurantsWithFilters,
  addSavedRestaurant,
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
import { Button, IconButton, Searchbar } from "react-native-paper";
import RestaurantDetailCard from "@/components/ui/RestaurantDetailCard";
import { Dropdown } from "react-native-element-dropdown";
import { CUISINE_GROUPS, HALAL_STATUSES } from "@/lib/utils";

const keyExtractor = item => item.id;

export default function MapScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState(null);
  const [selectedHalalStatus, setSelectedHalalStatus] = useState(null);

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
    console.log("fetching by name:", searchQuery);
    const restaurants = await getRestaurantsByName(searchQuery);
    setRestaurants(restaurants);
  };

  const fetchRestaurantsByCuisines = async cuisines => {
    // const cuisines = CUISINE_GROUPS[selectedCuisines];
    console.log("fetching by cuisines:", cuisines);
    const restaurants = await getRestaurantsByCuisines(cuisines);
    setRestaurants(restaurants);
  };

  const fetchRestaurantsWithFilters = async () => {
    console.log(`fetching with filters - cuisines: ${CUISINE_GROUPS[selectedCuisines]}, halal: ${selectedHalalStatus}`);
    const restaurants = await getRestaurantsWithFilters({
      cuisines: CUISINE_GROUPS[selectedCuisines],
      halal: selectedHalalStatus,
    });
    setRestaurants(restaurants);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedCuisines === null && selectedHalalStatus === null) {
      fetchRestaurants();
    } else {
      fetchRestaurantsWithFilters();
    }
  }, [selectedCuisines, selectedHalalStatus]);

  const onSubmitSearch = () => {
    bottomSheetModalRef.current?.dismiss();
    bottomSheetRef.current?.snapToIndex(1);

    if (searchQuery === "") {
      fetchRestaurants();
    } else {
      fetchRestaurantsByName();
    }
  };

  const resetRestaurantsSearch = () => {
    console.log("resetting search");
    bottomSheetModalRef.current?.dismiss();
    bottomSheetRef.current?.snapToIndex(0);

    setSearchQuery("");
    setSelectedCuisines(null);
    setSelectedHalalStatus(null);
    fetchRestaurants();
  };

  // callbacks
  const handleMapMarkerPress = useCallback(
    selectedRestaurantId => {
      const restaurant = restaurants.find(r => r.id === selectedRestaurantId);
      if (restaurant) {
        setSelectedRestaurant(restaurant);

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
        <View className="flex-1 items-center">
          <Text>No restaurants found</Text>
        </View>
      );
    }
    return <BottomSheetFlatList data={restaurants} keyExtractor={keyExtractor} renderItem={renderItem} />;
  }, [restaurants]);

  return (
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
              <View className="flex-row items-center">
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  // inputSearchStyle={styles.inputSearchStyle}
                  // iconStyle={styles.iconStyle}
                  data={Object.keys(CUISINE_GROUPS).map(item => ({ label: item, value: item }))}
                  // search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Cuisine"
                  // searchPlaceholder="Search..."
                  value={selectedCuisines}
                  // onFocus={() => setIsFocus(true)}
                  // onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    // console.log(item.value);
                    setSelectedCuisines(item.value);
                    // setIsFocus(false);
                  }}
                />
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  // inputSearchStyle={styles.inputSearchStyle}
                  // iconStyle={styles.iconStyle}
                  data={HALAL_STATUSES.map(item => ({ label: item, value: item }))}
                  // search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Halal Status"
                  // searchPlaceholder="Search..."
                  value={selectedHalalStatus}
                  // onFocus={() => setIsFocus(true)}
                  // onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    // console.log(item.value);
                    setSelectedHalalStatus(item.value);
                    // setIsFocus(false);
                  }}
                />
                <IconButton
                  mode="contained"
                  icon="close"
                  iconColor={"blue"}
                  size={20}
                  onPress={resetRestaurantsSearch}
                />
              </View>
            </View>
            <MapView
              ref={mapRef}
              // provider="google"
              style={styles.map}
              initialRegion={{
                latitude: 51.505,
                longitude: 0.0,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              }}
              showsUserLocation={true}
              showsCompass={false}
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
                  titleVisibility="visible"
                  tracksViewChanges={false}
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
              snapPoints={["15%", "40%", "80%"]}
              enableDynamicSizing={false}
            >
              <View className="flex-row justify-between mx-4 mb-4">
                <Text className="text-2xl font-bold">Results</Text>
                <Button
                  labelStyle={{ fontSize: 12, marginHorizontal: 16, marginVertical: 4 }}
                  style={{ margin: 0 }}
                  compact
                  mode="contained"
                  onPress={() => alert("Request to add a new restaurant. Fill in some deets.")}
                >
                  Request New
                </Button>
              </View>
              {restaurantResultsList}
            </BottomSheet>
            <BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={["50%"]}>
              <BottomSheetView>
                <RestaurantDetailCard restaurant={selectedRestaurant} />
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
  dropdown: {
    height: 50,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 8,
    width: 140,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
});
