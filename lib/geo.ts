export interface BiharCity {
  name: string;
  slug: string;
  region: string;
  lat: number;
  lng: number;
  isPrimary?: boolean;
}

export const BIHAR_CITIES: BiharCity[] = [
  { name: "Sasaram", slug: "sasaram", region: "Rohtas", lat: 24.9525, lng: 84.0298, isPrimary: true },
  { name: "Dehri-on-Sone", slug: "dehri-on-sone", region: "Rohtas", lat: 24.9126, lng: 84.1843, isPrimary: true },
  { name: "Patna", slug: "patna", region: "Capital", lat: 25.5941, lng: 85.1376 },
  { name: "Gaya", slug: "gaya", region: "Magadh", lat: 24.7914, lng: 85.0002 },
  { name: "Ara", slug: "ara", region: "Bhojpur", lat: 25.5560, lng: 84.6603 },
  { name: "Bhabua", slug: "bhabua", region: "Kaimur", lat: 25.0441, lng: 83.6127 },
  { name: "Aurangabad", slug: "aurangabad", region: "South Bihar", lat: 24.7539, lng: 84.3736 },
  { name: "Buxar", slug: "buxar", region: "West Bihar", lat: 25.5647, lng: 83.9777 },
];

/**
 * Haversine formula to calculate great-circle distance between two GPS coordinates in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest major Bihar event hub to the user's GPS coordinates
 */
export function findNearestBiharCity(lat: number, lng: number): BiharCity {
  let minDistance = Infinity;
  let nearestCity = BIHAR_CITIES[0]; // Default Sasaram

  for (const city of BIHAR_CITIES) {
    const dist = calculateDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = city;
    }
  }

  return nearestCity;
}

export const CITY_STORAGE_KEY = "getmyshow_user_city";
export const GEO_PROMPTED_KEY = "getmyshow_geo_prompted";

export function getUserStoredCity(): string {
  if (typeof window === "undefined") return "Sasaram";
  try {
    return localStorage.getItem(CITY_STORAGE_KEY) || "Sasaram";
  } catch {
    return "Sasaram";
  }
}

export function setUserStoredCity(city: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CITY_STORAGE_KEY, city);
    window.dispatchEvent(new CustomEvent("getmyshow:city-changed", { detail: { city } }));
  } catch (e) {
    console.error("Failed to store city in localStorage:", e);
  }
}
