export default function CancelPage() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">

      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl text-center">

        <div className="text-7xl mb-6">

          ❌

        </div>

        <h1 className="text-4xl font-bold mb-4 text-red-500">

          Zahlung abgebrochen

        </h1>

        <p className="text-gray-600 text-lg leading-8 mb-8">

          Deine Zahlung wurde nicht abgeschlossen.

        </p>

        <a
          href="/"
          className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold inline-block"
        >

          Zurück

        </a>

      </div>

    </div>

  );
}