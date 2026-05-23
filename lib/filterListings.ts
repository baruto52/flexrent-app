export function filterListings(

  listings: any[],

  search: string,

  category: string,

  rentalType: string,

  maxPrice: string
) {

  return listings.filter(
    (listing) => {

      // ACTIVE ONLY

      if (
        listing.active === false
      ) {

        return false;
      }

      // SEARCH

      if (
        search &&
        !listing.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) &&
        !listing.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      ) {

        return false;
      }

      // CATEGORY

      if (
        category &&
        listing.category !==
          category
      ) {

        return false;
      }

      // RENTAL TYPE

      if (
        rentalType &&
        listing.rental_type !==
          rentalType
      ) {

        return false;
      }

      // PRICE

      if (
        maxPrice &&
        Number(
          listing.price
        ) >
          Number(
            maxPrice
          )
      ) {

        return false;
      }

      return true;
    }
  );
}