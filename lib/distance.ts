export function calculateDistance(

  lat1: number,

  lon1: number,

  lat2: number,

  lon2: number
) {

  const R = 6371;

  const dLat =
    deg2rad(
      lat2 - lat1
    );

  const dLon =
    deg2rad(
      lon2 - lon1
    );

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +

    Math.cos(
      deg2rad(lat1)
    ) *
      Math.cos(
        deg2rad(lat2)
      ) *

    Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

function deg2rad(
  deg: number
) {

  return deg * (
    Math.PI / 180
  );
}

export function sortByDistance(

  listings: any[],

  userLat: number,

  userLng: number
) {

  return listings
    .map((listing) => {

      if (
        !listing.lat ||
        !listing.lng
      ) {

        return {

          ...listing,

          distance:
            999999,
        };
      }

      const distance =
        calculateDistance(

          userLat,

          userLng,

          listing.lat,

          listing.lng
        );

      return {

        ...listing,

        distance,
      };
    })
    .sort(
      (a, b) =>
        a.distance -
        b.distance
    );
}