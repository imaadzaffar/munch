import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RestaurantCard from "@/components/ui/RestaurantCard";
import RestaurantDetailCard from "@/components/ui/RestaurantDetailCard";
import RestaurantMapMarker from "@/components/ui/RestaurantMapMarker";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getUserData, getUserSavedRestaurants } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-paper";

export default function AccountScreen() {
  const USER_ID = "92214d35-7ed0-4f51-a131-afb9fa3c80f1";
  const color = useThemeColor({}, "background");
  console.log(color);

  const [userData, setUserData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // ref
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef({});
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // fetch
  const fetchSavedRestaurants = async () => {
    const restaurants = await getUserSavedRestaurants(USER_ID);
    setLoading(false);
    setRestaurants(restaurants);
  };

  const fetchUserData = async () => {
    const userData = await getUserData(USER_ID);
    console.log(userData);
    setLoading(false);
    setUserData(userData[0]);
  };

  useEffect(() => {
    fetchUserData();
    fetchSavedRestaurants();
  }, []);

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
    return <BottomSheetFlatList data={restaurants} keyExtractor={item => item.id} renderItem={renderItem} />;
  }, [restaurants]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <ThemedView className="h-[150] p-4 rounded-b-3xl z-10">
          <ThemedView className="flex-row justify-between items-center gap-4">
            <ThemedView className="flex-row items-center">
              <Image style={{ width: 80, height: 80, borderRadius: 999 }} source={userData.profile_pic} />
              <ThemedView className="ml-6">
                <ThemedText className="font-bold">@{userData.username}</ThemedText>
                <ThemedText>{userData.name}</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className="items-center">
              <ThemedText className="text-2xl font-bold">0</ThemedText>
              <ThemedText>Friends</ThemedText>
            </ThemedView>
            <ThemedView className="items-center">
              <ThemedText className="text-2xl font-bold text-green-500">
                {restaurants.filter(r => r.saved_type == "been").length}
              </ThemedText>
              <ThemedText>Visited</ThemedText>
            </ThemedView>
            <ThemedView className="items-center">
              <ThemedText className="text-2xl font-bold text-yellow-500">
                {restaurants.filter(r => r.saved_type == "saved").length}
              </ThemedText>
              <ThemedText>Saved</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText className="mt-4">{userData.bio}</ThemedText>
          {/* <Text>Following</Text>
          <Text>Followers</Text>
          <Text>Favourite Cuisines:</Text> */}
        </ThemedView>
        {!loading && (
          <>
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
                  <RestaurantMapMarker restaurant={r} type={r.saved_type} />
                  {/* <Text>{r.name}</Text> */}
                </Marker>
              ))}
            </MapView>
            <BottomSheet
              ref={bottomSheetRef}
              // index={0}
              snapPoints={["15%", "40%", "80%"]}
              enableDynamicSizing={false}
              backgroundStyle={{ backgroundColor: color }}
              handleIndicatorStyle={{ backgroundColor: "white" }}
            >
              <View className="flex-row justify-between mx-4 mb-4">
                <ThemedText className="text-2xl font-bold">My Restaurants</ThemedText>
                <Button
                  labelStyle={{ fontSize: 12, marginHorizontal: 16, marginVertical: 4 }}
                  style={{ margin: 0 }}
                  compact
                  mode="contained"
                  onPress={() => fetchSavedRestaurants()}
                >
                  Refresh
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
  map: {
    width: "100%",
    height: "100%",
    marginTop: -20,
  },
});
