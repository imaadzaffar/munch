import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";

import {
  getAllRestaurants,
  getUserSavedRestaurants,
  getUserReviewedRestaurants,
  getNearbyRestaurants,
} from "@/lib/supabase";
import { Restaurant } from "@/lib/types";
import RestaurantMapMarker from "@/components/ui/RestaurantMapMarker";

export default function MapScreen() {
  const [restaurants, setRestaurants] = useState([]);
  // const [visited, setVisited] = useState([]);
  // const [saved, setSaved] = useState([]);

  const fetchRestaurants = async () => {
    let restaurants = [];

    const allRestaurants = await getAllRestaurants();
    // console.log(allRestaurants);
    // setRestaurants(allRestaurants);
    if (allRestaurants) {
      const tmp = allRestaurants.map(r => {
        return { type: "all", ...r };
      });
      console.log(tmp);
      restaurants = [...tmp];
    }
    console.log(restaurants.length);

    const userId = "NK5hqbtMQvcTRISmZjQaVVhACBH2";

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
  }, []);

  const pinColors = {
    all: "red",
    saved: "yellow",
    visited: "blue",
  };

  return (
    <View style={styles.container}>
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
            key={r.id}
            coordinate={{
              latitude: r.location_lat,
              longitude: r.location_long,
            }}
            title={`${r.name} (${r.google_rating})`}
            description={r.cuisines.join(",")}
            // pinColor={pinColors[r.type]}
          >
            <RestaurantMapMarker restaurant={r} />
          </Marker>
        ))}
        {/* {saved.map((r, index) => (
          <Marker
            key={r.id}
            coordinate={{
              latitude: r.coordinates.latitude,
              longitude: r.coordinates.longitude,
            }}
            title={`${r.name} (${r.google_rating})`}
            description={r.cuisines.join(",")}
            pinColor="yellow"
          />
        ))}
        {visited.map((r, index) => (
          <Marker
            key={r.id}
            coordinate={{
              latitude: r.coordinates.latitude,
              longitude: r.coordinates.longitude,
            }}
            title={`${r.name} (${r.google_rating})`}
            description={r.cuisines.join(",")}
            pinColor="blue"
          />
        ))} */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
