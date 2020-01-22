import { geolocation, PositionOptions } from "geolocation";
const oneMinute = 60 * 1000;

const gpsOptions: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 30 * oneMinute,
  timeout: 5 * oneMinute
};

/**
 * Get "current" gps position.
 * Will cache position for up to 30m
 */
export async function getCurrentPositionAsync(): Promise<Position> {
  return new Promise<Position>((resolve, reject) => {
    geolocation.getCurrentPosition(resolve, reject, gpsOptions);
  });
}
