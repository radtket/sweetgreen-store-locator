import mapboxgl from "mapbox-gl";
import createPopUp from "./createPopUp";
import flyToStore from "./flyToStore";

/**
 * Add a marker to the map for every store listing.
 * */
const addMarkers = (stores, map) => {
  /* For each feature in the GeoJSON object above: */
  stores.features.forEach(marker => {
    /* Create a div element for the marker. */
    const el = document.createElement("div");
    /* Assign a unique `id` to the marker. */
    el.id = `marker-${marker.properties.id}`;
    /* Assign the `marker` class to each marker for styling. */
    el.className = "marker";

    /**
     * Create a marker using the div element
     * defined above and add it to the map.
     * */
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);

    /**
     * Listen to the element and when it is clicked, do three things:
     * 1. Fly to the point
     * 2. Close all other popups and display popup for clicked store
     * 3. Highlight listing in sidebar (and remove highlight for all other listings)
     * */
    el.addEventListener("click", e => {
      flyToStore(marker, map);
      createPopUp(marker, map);
      const [activeItem] = document.getElementsByClassName("active");
      e.stopPropagation();
      if (activeItem) {
        activeItem.classList.remove("active");
      }

      document
        .getElementById(`listing-${marker.properties.id}`)
        .classList.add("active");
    });
  });
};

export default addMarkers;
