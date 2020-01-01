const flyToStore = ({ geometry }, map) => {
  map.flyTo({
    center: geometry.coordinates,
    zoom: 15,
  });
};

export default flyToStore;
