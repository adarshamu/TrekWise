export async function searchPlace(text) {
  if (!text || text.length < 3) return [];
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      text
    )}&limit=5&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
  );
  const data = await res.json();
  return (data.features ?? []).map((place) => ({
    id: place.properties.place_id,
    name: place.properties.formatted,
    lat: place.properties.lat,
    lng: place.properties.lon,
  }));
}