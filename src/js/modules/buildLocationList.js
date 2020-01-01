import flyToStore from "./flyToStore";
import createPopUp from "./createPopUp";

/**
 * Add a listing for each store to the sidebar.
 * */
const buildLocationList = (data, map) => {
  data.features.forEach(
    ({
      properties: { id, address, city, phone, phoneFormatted, distance },
    }) => {
      /**
       * Create a shortcut for `store.properties`,
       * which will be used several times below.
       * */

      /* Add a new listing section to the sidebar. */
      const listings = document.getElementById("listings");
      const listing = listings.appendChild(document.createElement("div"));
      /* Assign a unique `id` to the listing. */
      listing.id = `listing-${id}`;
      /* Assign the `item` class to each listing for styling. */
      listing.className = "item";

      /* Add the link to the individual listing created above. */
      const link = listing.appendChild(document.createElement("a"));
      link.href = "#";
      link.className = "title";
      link.id = `link-${id}`;
      link.innerHTML = address;

      /* Add details to the individual listing. */
      const details = listing.appendChild(document.createElement("div"));
      details.innerHTML = city;
      if (phone) {
        details.innerHTML += ` · ${phoneFormatted}`;
      }
      if (distance) {
        const roundedDistance = Math.round(distance * 100) / 100;
        details.innerHTML += `<p><strong>${roundedDistance} miles away</strong></p>`;
      }

      /**
       * Listen to the element and when it is clicked, do four things:
       * 1. Update the `currentFeature` to the store associated with the clicked link
       * 2. Fly to the point
       * 3. Close all other popups and display popup for clicked store
       * 4. Highlight listing in sidebar (and remove highlight for all other listings)
       * */

      link.addEventListener("click", ({ target }) => {
        const clickedListing = data.features.find(
          ({ properties }) => target.id === `link-${properties.id}`
        );
        flyToStore(clickedListing, map);
        createPopUp(clickedListing, map);

        const [activeItem] = document.getElementsByClassName("active");
        if (activeItem) {
          activeItem.classList.remove("active");
        }
        target.parentNode.classList.add("active");
      });
    }
  );
};

export default buildLocationList;
