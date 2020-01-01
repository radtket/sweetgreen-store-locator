/**
 * Using the coordinates (lng, lat) for
 * (1) the search result and
 * (2) the closest store
 * construct a bbox that will contain both points
 */
const getBbox = (sortedStores, storeIdentifier, searchResult) => {
  const [searchLat, searchLon] = searchResult.coordinates;
  const [sortedLat, sortedLon] = sortedStores.features[
    storeIdentifier
  ].geometry.coordinates;

  const lats = [sortedLon, searchLon];
  const lons = [sortedLat, searchLat];

  const handleSort = cords =>
    cords.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });

  const [firstLon, secondLon] = handleSort(lons);
  const [firstLat, secondLat] = handleSort(lats);

  return [
    [firstLon, firstLat],
    [secondLon, secondLat],
  ];
};

export default getBbox;
