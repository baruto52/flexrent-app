"use client";

import {

  FaTimes,

  FaMapMarkerAlt,

  FaEnvelope,

  FaPhone,

  FaStar,

  FaUserEdit,

} from "react-icons/fa";

type Props = {

  user: any;

  profile: any;

  onClose: () => void;
};

export default function ProfileModal({

  user,

  profile,

  onClose,
}: Props) {

  return (

    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md overflow-y-auto">

      <div className="min-h-screen flex items-center justify-center p-6">

        <div className="bg-white w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl">

          {/* HERO */}

          <div className="relative h-[320px] bg-gradient-to-br from-green-500 to-green-700">

            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/20 text-white backdrop-blur-md flex items-center justify-center text-2xl"
            >

              <FaTimes />

            </button>

            {/* AVATAR */}

            <div className="absolute left-10 bottom-[-70px] flex items-end gap-6">

              <img
                src={
                  profile?.avatar_url ||
                  "https://i.pravatar.cc/300"
                }
                className="w-40 h-40 rounded-full border-[8px] border-white object-cover shadow-2xl"
              />

              <div className="pb-5 text-white">

                <h2 className="text-5xl font-black mb-3">

                  {profile?.display_name ||
                    "Benutzer"}

                </h2>

                <div className="flex items-center gap-3 text-xl">

                  <FaStar className="text-yellow-300" />

                  <span>

                    4.9 Bewertung

                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* CONTENT */}

          <div className="pt-28 p-10">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* LEFT */}

              <div className="lg:col-span-2">

                <h3 className="text-4xl font-black mb-8">

                  Über mich

                </h3>

                <p className="text-gray-600 text-xl leading-10 mb-12">

                  {profile?.bio ||
                    "Noch keine Beschreibung vorhanden."}

                </p>

                {/* STATS */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                  <div className="bg-gray-100 rounded-3xl p-6">

                    <h4 className="text-4xl font-black mb-2">

                      24

                    </h4>

                    <p className="text-gray-500">

                      Anzeigen

                    </p>

                  </div>

                  <div className="bg-gray-100 rounded-3xl p-6">

                    <h4 className="text-4xl font-black mb-2">

                      88

                    </h4>

                    <p className="text-gray-500">

                      Vermietungen

                    </p>

                  </div>

                  <div className="bg-gray-100 rounded-3xl p-6">

                    <h4 className="text-4xl font-black mb-2">

                      4.9

                    </h4>

                    <p className="text-gray-500">

                      Bewertung

                    </p>

                  </div>

                  <div className="bg-gray-100 rounded-3xl p-6">

                    <h4 className="text-4xl font-black mb-2">

                      3J

                    </h4>

                    <p className="text-gray-500">

                      Mitglied

                    </p>

                  </div>

                </div>

              </div>

              {/* RIGHT */}

              <div className="bg-gray-50 rounded-[35px] p-8 h-fit">

                <h3 className="text-3xl font-black mb-8">

                  Kontakt

                </h3>

                <div className="space-y-6">

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-xl">

                      <FaEnvelope />

                    </div>

                    <div>

                      <p className="text-gray-400 text-sm">

                        Email

                      </p>

                      <p className="font-bold">

                        {user?.email ||
                          "Keine Email"}

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-xl">

                      <FaPhone />

                    </div>

                    <div>

                      <p className="text-gray-400 text-sm">

                        Telefon

                      </p>

                      <p className="font-bold">

                        Nicht angegeben

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-xl">

                      <FaMapMarkerAlt />

                    </div>

                    <div>

                      <p className="text-gray-400 text-sm">

                        Standort

                      </p>

                      <p className="font-bold">

                        Deutschland

                      </p>

                    </div>

                  </div>

                </div>

                {/* BUTTON */}

                <button className="mt-10 w-full bg-black text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3">

                  <FaUserEdit />

                  Profil bearbeiten

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}