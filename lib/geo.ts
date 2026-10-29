export interface PopularBiharCity {
  name: string;
  slug: string;
  region: string;
  landmark: string;
  lat: number;
  lng: number;
  isPrimary?: boolean;
}

export const BIHAR_CITIES: PopularBiharCity[] = [
  { name: "Sasaram", slug: "sasaram", region: "Rohtas (HQ)", landmark: "Sher Shah Suri Tomb", lat: 24.9525, lng: 84.0298, isPrimary: true },
  { name: "Dehri-on-Sone", slug: "dehri-on-sone", region: "Rohtas", landmark: "Sone River Bridge", lat: 24.9126, lng: 84.1843, isPrimary: true },
  { name: "Patna", slug: "patna", region: "Capital", landmark: "Golghar & Museum", lat: 25.5941, lng: 85.1376 },
  { name: "Gaya", slug: "gaya", region: "Magadh", landmark: "Mahabodhi Temple", lat: 24.7914, lng: 85.0002 },
  { name: "Ara", slug: "ara", region: "Bhojpur", landmark: "Veer Kunwar Singh Fort", lat: 25.5560, lng: 84.6603 },
  { name: "Bhabua", slug: "bhabua", region: "Kaimur", landmark: "Mundeshwari Temple", lat: 25.0441, lng: 83.6127 },
  { name: "Aurangabad", slug: "aurangabad", region: "South Bihar", landmark: "Deo Sun Temple", lat: 24.7539, lng: 84.3736 },
  { name: "Buxar", slug: "buxar", region: "West Bihar", landmark: "Ramrekha Ghat", lat: 25.5647, lng: 83.9777 },
  { name: "Muzaffarpur", slug: "muzaffarpur", region: "North Bihar", landmark: "Garibnath Mandir", lat: 26.1209, lng: 85.3647 },
  { name: "Bhagalpur", slug: "bhagalpur", region: "Silk City", landmark: "Vikramshila University", lat: 25.2425, lng: 86.9842 },
  { name: "Darbhanga", slug: "darbhanga", region: "Mithila", landmark: "Raj Darbhanga Fort", lat: 26.1542, lng: 85.8918 },
  { name: "Begusarai", slug: "begusarai", region: "Industrial Hub", landmark: "Kanwar Lake", lat: 25.4182, lng: 86.1272 },
];

/**
 * Complete list of all 38 administrative districts & major cities in Bihar
 */
export const ALL_BIHAR_DISTRICTS: string[] = [
  "Araria",
  "Arwal",
  "Aurangabad",
  "Banka",
  "Begusarai",
  "Bhagalpur",
  "Bhojpur (Ara)",
  "Bhabua (Kaimur)",
  "Buxar",
  "Darbhanga",
  "East Champaran (Motihari)",
  "Gaya",
  "Gopalganj",
  "Jamui",
  "Jehanabad",
  "Katihar",
  "Khagaria",
  "Kishanganj",
  "Lakhisarai",
  "Madhepura",
  "Madhubani",
  "Munger",
  "Muzaffarpur",
  "Nalanda (Bihar Sharif)",
  "Nawada",
  "Patna",
  "Purnia",
  "Rohtas (Sasaram)",
  "Saharsa",
  "Samastipur",
  "Saran (Chhapra)",
  "Sheikhpura",
  "Sheohar",
  "Sitamarhi",
  "Siwan",
  "Supaul",
  "Vaishali (Hajipur)",
  "West Champaran (Bettiah)",
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
export function findNearestBiharCity(lat: number, lng: number): PopularBiharCity {
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

export function hasUserChosenCity(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return !!localStorage.getItem(CITY_STORAGE_KEY);
  } catch {
    return false;
  }
}

export function setUserStoredCity(city: string) {
  if (typeof window === "undefined") return;
  try {
    // Clean district formatting if e.g. "Rohtas (Sasaram)" -> "Sasaram"
    let cleanCity = city;
    if (city.includes("(") && city.includes(")")) {
      const match = city.match(/\((.*?)\)/);
      if (match && match[1]) {
        cleanCity = match[1];
      }
    }
    localStorage.setItem(CITY_STORAGE_KEY, cleanCity);
    window.dispatchEvent(new CustomEvent("getmyshow:city-changed", { detail: { city: cleanCity } }));
  } catch (e) {
    console.error("Failed to store city in localStorage:", e);
  }
}

export function openPickRegionModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("getmyshow:open-region-modal"));
}
