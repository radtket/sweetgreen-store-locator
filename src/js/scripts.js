import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import stores from "../data/stores";

// modules
import getBbox from "./modules/getBbox";
import buildLocationList from "./modules/buildLocationList";
import addMarkers from "./modules/addMarkers";
import createPopUp from "./modules/createPopUp";

const { distance } = require("@turf/turf");

/* This will let you use the .remove() function later on */
function remove() {
  if (this.parentNode) {
    this.parentNode.removeChild(this);
  }
}

if (!("remove" in Element.prototype)) {
  Element.prototype.remove = remove;
}

mapboxgl.accessToken =
  "pk.eyJ1IjoicmFkdGtldCIsImEiOiJjazRnN21pMmYwbDU2M2xwb3FyeTdoMHNjIn0.FA7qXQ-pGMnqyzkVyCKE7g";

/**
 * Add the map to the page
 */
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-77.034084142948, 38.909671288923],
  zoom: 13,
  scrollZoom: false,
});

/**
 * Assign a unique id to each store. You'll use this `id`
 * later to associate each point on the map with a listing
 * in the sidebar.
 */
stores.features.forEach((store, i) => {
  // eslint-disable-next-line no-param-reassign
  store.properties.id = i;
});

/**
 * Wait until the map loads to make changes to the map.
 */
map.on("load", () => {
  /**
   * This is where your '.addLayer()' used to be, instead
   * add only the source without styling a layer
   */
  map.addSource("places", {
    type: "geojson",
    data: stores,
  });

  /**
   * Create a new MapboxGeocoder instance.
   */
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl,
    marker: true,
    bbox: [-77.210763, 38.803367, -76.853675, 39.052643],
  });

  /**
   * Add all the things to the page:
   * - The location listings on the side of the page
   * - The search box (MapboxGeocoder) onto the map
   * - The markers onto the map
   */
  buildLocationList(stores, map);
  map.addControl(geocoder, "top-left");
  addMarkers(stores, map);

  /**
   * Listen for when a geocoder result is returned. When one is returned:
   * - Calculate distances
   * - Sort stores by distance
   * - Rebuild the listings
   * - Adjust the map camera
   * - Open a popup for the closest store
   * - Highlight the listing for the closest store.
   */
  geocoder.on("result", ({ result }) => {
    /* Get the coordinate of the search result */
    const { geometry: searchResultGeometry } = result;

    /**
     * Calculate distances:
     * For each store, use turf.disance to calculate the distance
     * in miles between the searchResult and the store. Assign the
     * calculated value to a property called `distance`.
     */

    stores.features.forEach(({ properties, geometry }) => {
      Object.defineProperty(properties, "distance", {
        value: distance(searchResultGeometry, geometry, { units: "miles" }),
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });

    /**
     * Sort stores by distance from closest to the `searchResult`
     * to furthest.
     */
    stores.features.sort(
      ({ properties: { distance: a } }, { properties: { distance: b } }) => {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0; // a must be equal to b
      }
    );

    /**
     * Rebuild the listings:
     * Remove the existing listings and build the location
     * list again using the newly sorted stores.
     */
    const listings = document.getElementById("listings");
    while (listings.firstChild) {
      listings.removeChild(listings.firstChild);
    }
    buildLocationList(stores);

    /* Open a popup for the closest store. */
    createPopUp(stores.features[0], map);

    /** Highlight the listing for the closest store. */
    const activeListing = document.getElementById(
      `listing-${stores.features[0].properties.id}`
    );
    activeListing.classList.add("active");

    /**
     * Adjust the map camera:
     * Get a bbox that contains both the geocoder result and
     * the closest store. Fit the bounds to that bbox.
     */

    const bbox = getBbox(stores, 0, searchResultGeometry);
    map.fitBounds(bbox, {
      padding: 100,
    });
  });
});
