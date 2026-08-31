/**
 * Geolocation & Distance utilities for FreshFind
 */

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

// Fallback to Kigali City Center (Kiyovu / UTC area)
export const DEFAULT_KIGALI_CENTER: GeoCoordinates = {
  lat: -1.9536,
  lng: 30.0605,
};

// District presets in Kigali
export const KIGALI_LANDMARKS: Record<string, GeoCoordinates> = {
  Kiyovu: { lat: -1.9536, lng: 30.0605 },
  Nyarutarama: { lat: -1.9355, lng: 30.0880 },
  Kacyiru: { lat: -1.9440, lng: 30.0750 },
  Kimihurura: { lat: -1.9520, lng: 30.0780 },
  Remera: { lat: -1.9560, lng: 30.1080 },
  Downtown: { lat: -1.9480, lng: 30.0570 },
  Gikondo: { lat: -1.9720, lng: 30.0710 },
  Nyamirambo: { lat: -1.9780, lng: 30.0450 },
};

/**
 * Calculates distance between two latitude/longitude points in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
  const distance = R * c;
  return Number(distance.toFixed(1));
}

/**
 * Format distance nicely (e.g. "450 m" or "1.2 km")
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Get current browser GPS location safely with timeout
 */
export async function getCurrentUserLocation(): Promise<{
  coords: GeoCoordinates;
  isRealGps: boolean;
  districtName?: string;
}> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({ coords: DEFAULT_KIGALI_CENTER, isRealGps: false, districtName: 'Kigali Center' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          isRealGps: true,
          districtName: 'Your Location',
        });
      },
      (error) => {
        console.warn('Geolocation failed or denied, using Kigali default:', error.message);
        resolve({ coords: DEFAULT_KIGALI_CENTER, isRealGps: false, districtName: 'Kigali (Default)' });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}
