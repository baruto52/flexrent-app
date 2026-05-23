export default function SuccessPage() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">

      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl text-center">

        <div className="text-7xl mb-6">

          ✅

        </div>

        <h1 className="text-4xl font-bold mb-4 text-green-600">

          Zahlung erfolgreich

        </h1>

        <p className="text-gray-600 text-lg leading-8 mb-8">

          Deine Buchung wurde erfolgreich bezahlt.

          Der Vermieter wurde informiert.

        </p>

        <a
          href="/"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold inline-block"
        >

          Zur Startseite

        </a>

      </div>

    </div>

  );
}