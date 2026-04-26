import React, { useMemo, useState } from "react";
import { MapPin, Heart, Trophy, Route, Search } from "lucide-react";
import { motion } from "motion/react";

const MACHINE_DATA = [
  { id: 1, name: "Food 4 Less - North Hollywood", city: "North Hollywood", state: "CA", zip: "91601", address: "12920 Sherman Way", retailer: "Food 4 Less", miles: 0.9 },
  { id: 2, name: "Pavilions - Studio City / North Hollywood Area", city: "Studio City", state: "CA", zip: "91604", address: "12630 Ventura Blvd", retailer: "Pavilions", miles: 1.3 },
  { id: 3, name: "Vons - Glendale", city: "Glendale", state: "CA", zip: "91205", address: "311 W Los Feliz Rd", retailer: "Vons", miles: 1.2 },
  { id: 4, name: "Albertsons - Glendale Area", city: "Glendale", state: "CA", zip: "91206", address: "3825 Ocean View Blvd", retailer: "Albertsons", miles: 1.5 },
  { id: 5, name: "Vons - La Crescenta", city: "La Crescenta", state: "CA", zip: "91214", address: "635 Foothill Blvd", retailer: "Vons", miles: 1.0 },
  { id: 6, name: "Vons - Pasadena", city: "Pasadena", state: "CA", zip: "91101", address: "155 W California Blvd", retailer: "Vons", miles: 1.4 },
  { id: 7, name: "Albertsons - Pasadena Area", city: "Pasadena", state: "CA", zip: "91107", address: "2981 E Colorado Blvd", retailer: "Albertsons", miles: 1.6 },
  { id: 8, name: "Albertsons - Temecula", city: "Temecula", state: "CA", zip: "92592", address: "31960 Temecula Pkwy", retailer: "Albertsons", miles: 1.8 },
  { id: 9, name: "Vons - Temecula", city: "Temecula", state: "CA", zip: "92591", address: "27420 Ynez Rd", retailer: "Vons", miles: 2.1 },
  { id: 10, name: "Vons - Los Angeles Area", city: "Los Angeles", state: "CA", zip: "90026", address: "4520 Sunset Blvd", retailer: "Vons", miles: 2.4 }
];

export default function Page() {
  const [query, setQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const filteredMachines = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MACHINE_DATA;

    return MACHINE_DATA.filter((m) =>
      [
        m.name,
        m.city,
        m.state,
        m.zip,
        m.address,
        m.retailer,
        m.city === "Los Angeles" ? "la" : ""
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  function toggleWishlist(id) {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-500 to-indigo-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90">
            <Trophy className="h-4 w-4" />
            Collector’s Quest
          </div>
          <h1 className="mt-2 text-3xl font-bold">Hunt. Collect. Level Up.</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/90">
            Track vending machine stops, save favorites, and build your collector route.
          </p>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
            <Search className="h-4 w-4" />
            Search by city, ZIP, state, or retailer
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try North Hollywood, 91601, Glendale, Pasadena..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {["North Hollywood", "Glendale", "Pasadena", "Temecula", "Los Angeles"].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="rounded-full bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
            >
              {term}
            </button>
          ))}
        </div>

        {filteredMachines.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-semibold">No exact matches found</p>
            <p className="mt-2 text-sm text-slate-600">
              Try nearby cities, ZIP codes, or a broader search.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMachines.map((machine) => (
              <motion.div
                key={machine.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">{machine.name}</h2>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                        Likely Stocked
                      </span>
                      {machine.miles <= 1.2 && (
                        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                          Walk Challenge
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      {machine.address}, {machine.city}, {machine.state} {machine.zip}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-slate-100 px-2 py-1">{machine.retailer}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">{machine.miles} mi away</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleWishlist(machine.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      <Heart
                        className={`h-4 w-4 ${wishlist.includes(machine.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                      {wishlist.includes(machine.id) ? "Saved" : "Wishlist"}
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${machine.address}, ${machine.city}, ${machine.state} ${machine.zip}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      <Route className="h-4 w-4" />
                      Directions
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
