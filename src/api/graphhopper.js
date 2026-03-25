export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

export function formatDuration(decimalHours) {
  if (decimalHours === null || decimalHours === undefined) return "N/A";
  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

export async function getRouteInfo(startLat, startLng, endLat, endLng, vehicle = "car") {
  const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
  if (!apiKey) {
    console.error("GraphHopper API key is missing.");
    return null;
  }

  const url = `https://graphhopper.com/api/1/route?point=${startLat},${startLng}&point=${endLat},${endLng}&vehicle=${vehicle}&locale=en&calc_points=true&points_encoded=false&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GraphHopper failed: ${response.status}`);

    const data = await response.json();
    if (!data.paths || data.paths.length === 0) throw new Error("No route found.");

    const path = data.paths[0];
    const decimalHours = path.time / 1000 / 60 / 60;

    return {
      distanceKm: (path.distance / 1000).toFixed(2),
      durationHrs: decimalHours.toFixed(2),
      durationFormatted: formatDuration(decimalHours),
      coordinates: path.points.coordinates,
      vehicle,
      isFallback: false,
    };
  } catch (error) {
    console.warn("GraphHopper failed, using straight-line fallback:", error.message);
    return {
      distanceKm: haversineDistance(startLat, startLng, endLat, endLng),
      durationHrs: null,
      durationFormatted: "N/A",
      coordinates: [],
      vehicle,
      isFallback: true,
    };
  }
}

export function toPolylinePath(coordinates = []) {
  if (!Array.isArray(coordinates)) return [];
  return coordinates.map(([lng, lat]) => ({ lat, lng }));
}