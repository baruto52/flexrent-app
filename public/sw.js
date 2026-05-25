self.addEventListener(
  "install",
  () => {

    self.skipWaiting();
  }
);

self.addEventListener(
  "activate",
  () => {

    console.log(
      "Service Worker Active"
    );
  }
);

self.addEventListener(
  "push",
  (event) => {

    const data =
      event.data?.json();

    self.registration
      .showNotification(

        data?.title ||
          "LOQARO",

        {

          body:
            data?.body ||

            "Neue Benachrichtigung",

          icon:
            "/icon-192.png",
        }
      );
  }
);