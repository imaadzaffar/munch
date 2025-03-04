import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";

import { getAllRestaurants } from "@/lib/firebase";

export default function MapScreen() {
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    const data = await getAllRestaurants();
    // console.log(data);
    setRestaurants(data);
    // console.log(restaurants.length);
    // restaurants.forEach((d) => {
    //   console.log(d.coordinates);
    // });
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        key={restaurants.length}
        style={styles.map}
        initialRegion={{
          latitude: 51.505,
          longitude: 0.0,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {restaurants.map((r, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: r.coordinates.latitude,
              longitude: r.coordinates.longitude,
            }}
            title={`${r.name} (${r.google_rating})`}
            description={r.cuisines.join(",")}
          />
        ))}
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
