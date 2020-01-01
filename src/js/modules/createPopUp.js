import { Popup } from "mapbox-gl";

/**
 * Create a Mapbox GL JS `Popup`.
 * */

const createPopUp = ({ geometry, properties }, map) => {
  const [popUps] = document.getElementsByClassName("mapboxgl-popup");

  if (popUps) {
    popUps.remove();
  }

  new Popup({ closeOnClick: false })
    .setLngLat(geometry.coordinates)
    .setHTML(`<h3>Sweetgreen</h3><h4>${properties.address}</h4>`)
    .addTo(map);
};

export default createPopUp;
