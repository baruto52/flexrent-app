export async function getUserLocation() {

  return new Promise<{

    lat: number;

    lng: number;

  } | null>((resolve) => {

    if (
      !navigator.geolocation
    ) {

      resolve(null);

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        resolve({

          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude,
        });

      },

      () => {

        resolve(null);

      },

      {
        enableHighAccuracy: true,
      }
    );
  });
}