import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// const supabaseUrl = "https://tdvlgijqbwsgoyzfdkma.supabase.co";
// const supabaseAnonKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdmxnaWpxYndzZ295emZka21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzA0MjUsImV4cCI6MjA1NzE0NjQyNX0.P5eXqXLpuxIuUSLBBZYtsnRNRTrjxl2Hr9qJSdr5FW8";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getAllUsers = async () => {
  const { data, error } = await supabase.from("profiles").select();
};

const getUserData = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select().eq("id", userId);
  if (error) {
    console.error(error);
    return;
  }
  return data;
};

const getAllRestaurants = async () => {
  const { data, error } = await supabase
    .from("restaurants")
    .select()
    .neq("location", null)
    // .eq("status", "published")
    .order("google_rating_count", { ascending: false })
    .order("google_rating", { ascending: false });
  if (error) {
    console.error(error);
    return;
  }
  return data;
};

const getNearbyRestaurants = async (lat: number, long: number) => {
  const { data, error } = await supabase.rpc("nearby_restaurants", { lat, long }).limit(10);
  if (error) {
    console.error(error);
    return;
  }
  return data;
};

const getRestaurantsInView = async (min_lat: number, min_long: number, max_lat: number, max_long: number) => {
  const { data, error } = await supabase.rpc("restaurants_in_view", { min_lat, min_long, max_lat, max_long }).limit(10);
};

const getRestaurantsByCuisines = async (cuisines: string[]) => {
  const { data, error } = await supabase
    .from("restaurants")
    .select()
    .overlaps("cuisines", cuisines)
    // .eq("status", "published")
    .neq("cuisines", "{}");
  if (error) {
    console.error(error);
    return;
  }
  return data;
};

const getRestaurantsByName = async (name: string) => {
  const { data, error } = await supabase
    .from("restaurants")
    .select()
    // .eq("status", "published")
    .textSearch("name", name, { type: "websearch" });
  if (error) {
    console.error(error);
    return;
  }
  return data;
};

const getRestaurantsWithFilters = async ({ cuisines, halal }: { cuisines: string[], halal: string }) => {
  const { data, error } = await supabase
    .from("restaurants")
    .select()
    .overlaps("cuisines", cuisines)
    .eq("halal_info->fully_halal", halal === "Fully Halal");
  // .eq("status", "published")
  // .textSearch("name", name, { type: "websearch" });
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
  return data;
};

const getUserSavedRestaurants = async (userId: string) => {
  const { data, error } = await supabase
    .from("users_saved_restaurants")
    .select("created_at, type, restaurants(*)")
    .eq("user_id", userId);
  if (error) {
    console.error(error);
    return;
  }
  const formattedData = data.map(item => ({ ...item.restaurants, saved_at: item.created_at, saved_type: item.type }));
  return formattedData;
};

const getUserReviewedRestaurants = async (userId: string) => {
  const { data, error } = await supabase.from("reviews").select().eq("user_id", userId);
};

const getFollowing = async (userId: string) => {
  const { data, error } = await supabase
    .from("friendships")
    .select("profiles!friendships_from_id_fkey(id, username, name)")
    .eq("from_id", userId);
};

const getRecommendations = async (userId: string) => {};
const addFollowing = async (userId: string, followingId: string) => {};
const removeFollowing = async (userId: string, followingId: string) => {};
const addBeenRestaurant = async (userId: string, restaurantId: string) => {
  const { data, error } = await supabase
    .from("users_saved_restaurants")
    .insert([{ user_id: userId, restaurant_id: restaurantId, type: "been" }]);
  if (error) {
    console.error(error);
    return;
  }
  return data;
};
const addSavedRestaurant = async (userId: string, restaurantId: string) => {
  const { data, error } = await supabase
    .from("users_saved_restaurants")
    .insert([{ user_id: userId, restaurant_id: restaurantId, type: "saved" }]);
  if (error) {
    console.error(error);
    return;
  }
  return data;
};
const updateSavedRestaurant = async (userId: string, restaurantId: string, type: string) => {
  const { data, error } = await supabase
    .from("users_saved_restaurants")
    .update({ type: type })
    .eq("user_id", userId)
    .eq("restaurant_id", restaurantId);
  if (error) {
    console.error(error);
    return;
  }
  return data;
};
const removeSavedRestaurant = async (userId: string, restaurantId: string) => {
  const { data, error } = await supabase
    .from("users_saved_restaurants")
    .delete()
    .eq("user_id", userId)
    .eq("restaurant_id", restaurantId);
  if (error) {
    console.error(error);
    return;
  }
  return data;
};
const addFavouriteRestaurant = async (userId: string, restaurantId: string) => {};
const removeFavouriteRestaurant = async (userId: string, restaurantId: string) => {};
const addReview = async (userId: string, restaurantId: string, rating: number, review: string) => {};
const updateReview = async (userId: string, restaurantId: string, rating: number, review: string) => {};
const deleteReview = async (userId: string, restaurantId: string) => {};
const addRestaurantRequest = async (
  name: string,
  location: string,
  google_rating: number,
  google_place_id: string
) => {};

export {
  getAllUsers,
  getUserData,
  getAllRestaurants,
  getUserSavedRestaurants,
  getUserReviewedRestaurants,
  getNearbyRestaurants,
  getRestaurantsInView,
  getRestaurantsByName,
  getRestaurantsByCuisines,
  getRestaurantsWithFilters,
  getFollowing,
  addBeenRestaurant,
  addSavedRestaurant,
  updateSavedRestaurant,
  removeSavedRestaurant,
};
