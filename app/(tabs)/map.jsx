import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";

import {
  getAllRestaurants,
  getUserSavedRestaurants,
  getUserReviewedRestaurants,
  getRestaurantsByIds,
} from "@/lib/firebase";

export default function MapScreen() {
  const [restaurants, setRestaurants] = useState([]);
  // const [visited, setVisited] = useState([]);
  // const [saved, setSaved] = useState([]);

  const fetchRestaurants = async () => {
    console.log("hello");
    let restaurants = [];
    const allRestaurants = await getAllRestaurants();
    console.log(allRestaurants);
    // setRestaurants(allRestaurants);
    restaurants = [...allRestaurants];
    console.log(restaurants.length);

    const userId = "NK5hqbtMQvcTRISmZjQaVVhACBH2";

    const savedIds = await getUserSavedRestaurants(userId);
    const savedRestaurants = await getRestaurantsByIds(savedIds);
    savedRestaurants.forEach((s) => {
      const index = restaurants.findIndex((r) => s.id === r.id);
      if (index === -1) restaurants.push({ type: "saved", ...s });
      else restaurants[index].type = "saved";
    });
    // restaurants = restaurants.concat(
    //   savedRestaurants.map((r) => {
    //     return { type: "saved", ...r };
    //   })
    // );
    console.log(restaurants.length);
    // setSaved(savedRestaurants);

    const reviewedIds = await getUserReviewedRestaurants(userId);
    const visitedRestaurants = await getRestaurantsByIds(reviewedIds);
    visitedRestaurants.forEach((v) => {
      const index = restaurants.findIndex((r) => v.id === r.id);
      if (index === -1) restaurants.push({ type: "visited", ...v });
      else restaurants[index].type = "visited";
    });
    // restaurants = restaurants.concat(
    //   visitedRestaurants.map((r) => {
    //     return { type: "visited", ...r };
    //   })
    // );
    console.log(restaurants.length);
    // setVisited(visitedRestaurants);

    // console.log(restaurants);
    setRestaurants(restaurants);
  };

  const pinColors = {
    all: "red",
    saved: "yellow",
    visited: "blue",
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

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
              latitude: r.coordinates.latitude,
              longitude: r.coordinates.longitude,
            }}
            title={`${r.name} (${r.google_rating})`}
            description={r.cuisines.join(",")}
            pinColor={pinColors[r.type]}
          />
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
