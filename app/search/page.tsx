import { Suspense } from "react";

import SearchClient from "./SearchClient";

export default function Page() {

  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-2xl font-black">
            Loading...
          </div>
        </main>
      }
    >
      <SearchClient />
    </Suspense>
  );
}