"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  Heart,
  PlusCircle,
  Navigation,
  Clipboard,
  Trophy,
  User,
  LayoutGrid,
  Flame,
  Footprints,
  ChevronRight,
  Camera,
  X,
  AlertCircle,
  Coins,
  Zap,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useGameState } from "../hooks/useGameState";
import { PRODUCT_TYPES, RARITIES, BADGES } from "../data/appData";

// ─── SoCal machine data — embedded directly so no import cache can affect it ──
const MACHINES = [
  {
    id: "1",
    name: "Food 4 Less - North Hollywood",
    city: "North Hollywood",
    state: "CA",
    zip: "91601",
    address: "12920 Sherman Way",
    retailer: "Food 4 Less",
    distance: "0.9",
    status: "Likely Stocked",
    hasWalkChallenge: true,
    isRouteBonus: false,
    aliases: ["north hollywood", "noho", "91601", "los angeles", "la", "sfv"],
  },
  {
    id: "2",
    name: "Pavilions - Studio City / North Hollywood Area",
    city: "Studio City",
    state: "CA",
    zip: "91604",
    address: "12630 Ventura Blvd",
    retailer: "Pavilions",
    distance: "1.3",
    status: "Recently Reported",
    hasWalkChallenge: false,
    isRouteBonus: true,
    aliases: [
      "studio city",
      "north hollywood",
      "91604",
      "los angeles",
      "la",
      "sfv",
    ],
  },
  {
    id: "3",
    name: "Vons - Glendale",
    city: "Glendale",
    state: "CA",
    zip: "91205",
    address: "311 W Los Feliz Rd",
    retailer: "Vons",
    distance: "1.2",
    status: "Likely Stocked",
    hasWalkChallenge: false,
    isRouteBonus: false,
    aliases: ["glendale", "91205"],
  },
  {
    id: "4",
    name: "Albertsons - Glendale Area",
    city: "Glendale",
    state: "CA",
    zip: "91206",
    address: "3825 Ocean View Blvd",
    retailer: "Albertsons",
    distance: "1.5",
    status: "Check First",
    hasWalkChallenge: false,
    isRouteBonus: false,
    aliases: ["glendale", "91206"],
  },
  {
    id: "5",
    name: "Vons - La Crescenta",
    city: "La Crescenta",
    state: "CA",
    zip: "91214",
    address: "635 Foothill Blvd",
    retailer: "Vons",
    distance: "1.0",
    status: "Likely Stocked",
    hasWalkChallenge: true,
    isRouteBonus: false,
    aliases: ["la crescenta", "91214", "glendale", "montrose"],
  },
  {
    id: "6",
    name: "Vons - Pasadena",
    city: "Pasadena",
    state: "CA",
    zip: "91101",
    address: "155 W California Blvd",
    retailer: "Vons",
    distance: "1.4",
    status: "Recently Reported",
    hasWalkChallenge: false,
    isRouteBonus: true,
    aliases: ["pasadena", "91101", "altadena", "sgv"],
  },
  {
    id: "7",
    name: "Albertsons - Pasadena Area",
    city: "Pasadena",
    state: "CA",
    zip: "91107",
    address: "2981 E Colorado Blvd",
    retailer: "Albertsons",
    distance: "1.6",
    status: "Check First",
    hasWalkChallenge: false,
    isRouteBonus: false,
    aliases: ["pasadena", "91107", "sgv"],
  },
  {
    id: "8",
    name: "Albertsons - Temecula",
    city: "Temecula",
    state: "CA",
    zip: "92592",
    address: "31960 Temecula Pkwy",
    retailer: "Albertsons",
    distance: "1.8",
    status: "Likely Stocked",
    hasWalkChallenge: false,
    isRouteBonus: true,
    aliases: ["temecula", "92592", "murrieta", "inland empire"],
  },
  {
    id: "9",
    name: "Vons - Temecula",
    city: "Temecula",
    state: "CA",
    zip: "92591",
    address: "27420 Ynez Rd",
    retailer: "Vons",
    distance: "2.1",
    status: "Recently Reported",
    hasWalkChallenge: false,
    isRouteBonus: false,
    aliases: ["temecula", "92591", "murrieta", "inland empire"],
  },
  {
    id: "10",
    name: "Vons - Los Angeles Area",
    city: "Los Angeles",
    state: "CA",
    zip: "90026",
    address: "4520 Sunset Blvd",
    retailer: "Vons",
    distance: "2.4",
    status: "Likely Stocked",
    hasWalkChallenge: false,
    isRouteBonus: false,
    aliases: ["los angeles", "la", "90026", "silver lake", "echo park"],
  },
];

// ─── Badge chip ────────────────────────────────────────────────────────────
const Chip = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
    game: "bg-indigo-600 text-white shadow-sm",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

// ─── Reward toast ──────────────────────────────────────────────────────────
const RewardToast = ({ notification, onComplete }) => {
  if (!notification) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="toast"
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.8 }}
        onAnimationComplete={() => setTimeout(onComplete, 2000)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white shadow-2xl rounded-2xl p-4 border border-indigo-100 min-w-[240px] text-center"
      >
        {notification.type === "reward" && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold text-slate-500 uppercase">
              Awesome Pull!
            </span>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Zap size={20} className="text-indigo-600" />
                </div>
                <span className="text-xl font-black text-indigo-600">
                  +{notification.xp} XP
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Coins size={20} className="text-amber-600" />
                </div>
                <span className="text-xl font-black text-amber-600">
                  +{notification.coins}
                </span>
              </div>
            </div>
          </div>
        )}
        {notification.type === "level_up" && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-indigo-600">
              LEVEL UP!
            </span>
            <span className="text-sm font-medium text-slate-500">
              You reached level {notification.value}
            </span>
            <div className="mt-2 text-4xl">🎉</div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main app ──────────────────────────────────────────────────────────────
export default function PokemonVendingAdventure() {
  const [activeTab, setActiveTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const {
    state,
    logPull,
    toggleWishlist,
    updateMachineNote,
    togglePartnerMode,
    completeChallenge,
    simulateSteps,
    getTrainerTitle,
    notification,
    clearNotification,
  } = useGameState();

  // ── Search logic ─────────────────────────────────────────────────────
  const { machines: filteredMachines, searchFallback } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let matched;
    let fallback = false;

    if (!q) {
      matched = MACHINES;
    } else {
      const direct = MACHINES.filter(
        (m) =>
          m.city?.toLowerCase().includes(q) ||
          m.zip?.includes(q) ||
          m.state?.toLowerCase().includes(q) ||
          m.retailer?.toLowerCase().includes(q) ||
          m.name?.toLowerCase().includes(q) ||
          m.address?.toLowerCase().includes(q) ||
          (m.aliases && m.aliases.some((a) => a.toLowerCase().includes(q))),
      );
      if (direct.length > 0) {
        matched = direct;
      } else {
        matched = MACHINES;
        fallback = true;
      }
    }

    if (showWishlistOnly) {
      matched = matched.filter((m) => state.wishlist.includes(m.id));
    }

    return { machines: matched, searchFallback: fallback };
  }, [searchQuery, showWishlistOnly, state.wishlist]);

  // ── Explore ──────────────────────────────────────────────────────────
  const renderExplore = () => (
    <div className="space-y-5 pb-24">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="City, ZIP, or retailer..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowWishlistOnly(!showWishlistOnly)}
          className={`p-3 rounded-2xl border transition-all ${showWishlistOnly ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-white border-slate-200 text-slate-400 shadow-sm"}`}
        >
          <Heart size={20} fill={showWishlistOnly ? "currentColor" : "none"} />
        </button>
      </div>

      {/* SoCal city pills */}
      {!searchQuery && (
        <div className="flex flex-wrap gap-2">
          {[
            "North Hollywood",
            "Glendale",
            "Pasadena",
            "Temecula",
            "La Crescenta",
            "Los Angeles",
          ].map((tip) => (
            <button
              key={tip}
              onClick={() => setSearchQuery(tip)}
              className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 active:scale-95 transition-transform"
            >
              {tip}
            </button>
          ))}
        </div>
      )}

      {/* Fallback notice */}
      {searchFallback && searchQuery && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-3">
          <AlertCircle
            size={16}
            className="text-amber-600 mt-0.5 flex-shrink-0"
          />
          <p className="text-xs text-amber-700 font-medium leading-snug">
            No exact matches for{" "}
            <span className="font-bold">"{searchQuery}"</span>. Showing nearby
            Southern California machines.
          </p>
        </div>
      )}

      {/* Daily quests */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-lg flex items-center gap-2">
            <Trophy size={20} /> Daily Quests
          </h3>
          <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
            Reset in 12h
          </span>
        </div>
        <div className="space-y-3">
          {state.quests.map((quest) => (
            <div key={quest.id}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>{quest.text}</span>
                <span>
                  {quest.progress}/{quest.total}
                </span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(quest.progress / quest.total) * 100}%`,
                  }}
                  className={`h-full ${quest.completed ? "bg-green-400" : "bg-white"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Machine list */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-black text-xl text-slate-800">
            {searchQuery && !searchFallback
              ? `Results for "${searchQuery}"`
              : "Nearby Machines"}
          </h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredMachines.length} found
          </span>
        </div>

        {filteredMachines.length > 0 ? (
          filteredMachines.map((machine) => {
            const isWishlisted = state.wishlist.includes(machine.id);
            const statusVariant =
              machine.status === "Likely Stocked"
                ? "success"
                : machine.status === "Recently Reported"
                  ? "info"
                  : "warning";
            return (
              <div
                key={machine.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-2">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1.5">
                      {machine.name}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <Chip variant={statusVariant}>{machine.status}</Chip>
                      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full">
                        {machine.retailer}
                      </span>
                    </div>
                    <div className="flex items-start text-xs text-slate-500 gap-1">
                      <MapPin size={11} className="mt-0.5 flex-shrink-0" />
                      <span>
                        {machine.address}, {machine.city}, {machine.state}{" "}
                        {machine.zip}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 ml-4">
                      ~{machine.distance} mi away
                    </p>
                  </div>
                  <button
                    onClick={() => toggleWishlist(machine.id)}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${isWishlisted ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-300"}`}
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {machine.hasWalkChallenge && (
                    <Chip variant="game">🏃‍♂️ Walk Challenge</Chip>
                  )}
                  {machine.isRouteBonus && (
                    <Chip variant="game">🌟 Route Bonus</Chip>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-3 mb-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
                    <Clipboard size={10} /> Machine Notes
                  </div>
                  <textarea
                    className="w-full bg-transparent text-xs text-slate-700 resize-none focus:outline-none"
                    placeholder="e.g. 'Always has ETBs', 'Near the snacks'..."
                    rows={1}
                    value={state.machineNotes[machine.id] || ""}
                    onChange={(e) =>
                      updateMachineNote(machine.id, e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedMachine(machine);
                      setIsLogModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-2xl py-3 text-sm font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-transform"
                  >
                    <PlusCircle size={16} /> Log Pull
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(machine.address + ", " + machine.city + ", " + machine.state)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-slate-800 text-white rounded-2xl py-3 text-sm font-bold active:scale-95 transition-transform"
                  >
                    <Navigation size={16} /> Directions
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500 font-medium">
              No wishlisted machines yet.
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Tap ♡ on any machine card to save it.
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-3">
        <div className="flex items-start gap-2">
          <AlertCircle
            size={16}
            className="text-amber-600 mt-0.5 flex-shrink-0"
          />
          <p className="text-[11px] text-amber-800 leading-snug font-medium">
            <span className="font-black">Demo Data Disclaimer:</span> Machine
            locations are sample/demo data for Southern California and may not
            reflect current official placements. Confirm availability before
            visiting.
          </p>
        </div>
        <a
          href="https://vending.pokemon.com/en-us"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-amber-500 text-white rounded-2xl py-3 text-sm font-black shadow-md active:scale-95 transition-all"
        >
          <MapPin size={16} />
          Open Official Pokémon Locator ↗
        </a>
      </div>
    </div>
  );

  // ── Collection ───────────────────────────────────────────────────────
  const renderCollection = () => (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-2xl text-slate-800">Your Catalog</h2>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
          {state.collection.length} Pulls
        </span>
      </div>
      {state.collection.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {state.collection.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100"
            >
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 bg-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt="Pull Proof"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera size={24} className="text-slate-300" />
                  )}
                  <div className="absolute top-1 right-1">
                    <Chip variant="game">{item.rarity.split(" ")[0]}</Chip>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">
                      {item.setName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {item.productType} • {item.rarity}
                    </p>
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400 gap-1">
                    <MapPin size={10} /> {item.machineName} •{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {item.notes && (
                <div className="px-4 pb-4">
                  <div className="bg-slate-50 rounded-xl p-2 text-[11px] text-slate-600 italic">
                    "{item.notes}"
                  </div>
                </div>
              )}
              <div className="bg-slate-50 px-4 py-3 flex justify-between items-center">
                <button className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <Navigation size={12} /> Directions Back
                </button>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid size={32} className="text-slate-300" />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">No pulls logged yet</h3>
          <p className="text-slate-500 text-sm px-12">
            Head to Explore and tap "Log Pull" on a machine in North Hollywood,
            Glendale, Pasadena, or Temecula.
          </p>
        </div>
      )}
    </div>
  );

  // ── Challenges ───────────────────────────────────────────────────────
  const renderChallenges = () => (
    <div className="space-y-6 pb-24">
      <h2 className="font-black text-2xl text-slate-800">Route Challenges</h2>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Footprints size={32} className="text-indigo-600" />
        </div>
        <h3 className="font-black text-3xl text-slate-800">
          {state.steps.toLocaleString()}
        </h3>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">
          Daily Steps
        </p>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((state.steps / 10000) * 100, 100)}%`,
            }}
            className="h-full bg-indigo-600 rounded-full"
          />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase">
          Goal: 10,000 steps
        </p>
        <button
          onClick={simulateSteps}
          className="mt-6 w-full py-3 bg-slate-800 text-white rounded-2xl font-bold text-sm active:scale-95 transition-transform"
        >
          Simulate Steps (MVP Demo)
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-lg text-slate-800">Featured Routes</h3>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">
            Active
          </div>
          <h4 className="font-bold text-slate-900 mb-1">SoCal Machine Hunt</h4>
          <p className="text-xs text-slate-500 mb-4">
            Visit Food 4 Less North Hollywood + Vons Glendale
          </p>
          <div className="flex justify-between items-end">
            <div className="flex gap-1">
              <Chip variant="game">XP +100</Chip>
              <Chip variant="game">Coins +50</Chip>
            </div>
            <button
              onClick={() => completeChallenge("socal_hunt", 100, 50)}
              disabled={state.completedChallenges.includes("socal_hunt")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${state.completedChallenges.includes("socal_hunt") ? "bg-green-50 text-green-600" : "bg-indigo-600 text-white shadow-lg shadow-indigo-100"}`}
            >
              {state.completedChallenges.includes("socal_hunt")
                ? "Completed ✓"
                : "Finish Route"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Profile ──────────────────────────────────────────────────────────
  const renderProfile = () => (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col items-center text-center pt-4">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full p-1 shadow-xl mb-4">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
        </div>
        <h2 className="font-black text-2xl text-slate-900 tracking-tight">
          {getTrainerTitle()}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <Chip variant="info">Level {state.level}</Chip>
          <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
            <Flame size={12} className="text-orange-500" /> {state.streak} Day
            Streak
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-amber-100 p-1.5 rounded-lg">
              <Coins size={16} className="text-amber-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">
              Coins
            </span>
          </div>
          <div className="text-xl font-black text-slate-800">{state.coins}</div>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-indigo-100 p-1.5 rounded-lg">
              <Zap size={16} className="text-indigo-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase">
              Total XP
            </span>
          </div>
          <div className="text-xl font-black text-slate-800">
            {state.xp.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-black text-slate-400 uppercase">
            Level Progress
          </span>
          <span className="text-xs font-bold text-indigo-600">
            {state.xp % 500} / 500 XP
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((state.xp % 500) / 500) * 100}%` }}
            className="h-full bg-indigo-600 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-lg text-slate-800">Your Badges</h3>
        <div className="grid grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const isEarned = state.badges.includes(badge.id);
            return (
              <div key={badge.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${isEarned ? "bg-white shadow-md shadow-indigo-100 border-2 border-indigo-200" : "bg-slate-50 grayscale opacity-30 border-2 border-transparent"}`}
                >
                  {badge.icon}
                </div>
                <span
                  className={`text-[9px] font-bold text-center leading-tight uppercase ${isEarned ? "text-indigo-600" : "text-slate-300"}`}
                >
                  {badge.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── Shell ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <RewardToast notification={notification} onComplete={clearNotification} />

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-black text-xl text-slate-900 tracking-tight">
            Pokémon Vending
          </h1>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              SoCal Adventure
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-1">
            <span
              className={`text-[10px] font-black uppercase transition-colors ${state.partnerMode ? "text-indigo-600" : "text-slate-400"}`}
            >
              Partner Mode
            </span>
            {state.partnerMode && (
              <span className="text-[8px] text-slate-400 italic">
                Adventuring Together!
              </span>
            )}
          </div>
          <button
            onClick={togglePartnerMode}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${state.partnerMode ? "bg-indigo-600" : "bg-slate-200"}`}
          >
            <motion.div
              animate={{ x: state.partnerMode ? 24 : 0 }}
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center"
            >
              {state.partnerMode && (
                <Users size={10} className="text-indigo-600" />
              )}
            </motion.div>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "explore" && renderExplore()}
            {activeTab === "collection" && renderCollection()}
            {activeTab === "challenges" && renderChallenges()}
            {activeTab === "profile" && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Log Pull Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Log Your Pull
                  </h3>
                  <p className="text-slate-500 text-sm">
                    at {selectedMachine?.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsLogModalOpen(false)}
                  className="p-2 bg-slate-50 rounded-full text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  logPull({
                    machineId: selectedMachine.id,
                    machineName: selectedMachine.name,
                    productType: fd.get("productType"),
                    setName: fd.get("setName"),
                    rarity: fd.get("rarity"),
                    notes: fd.get("notes"),
                    photo:
                      "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?auto=format&fit=crop&q=80&w=200&h=200",
                  });
                  setIsLogModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">
                    Product Type
                  </label>
                  <select
                    name="productType"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                    required
                  >
                    {PRODUCT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">
                    Set Name
                  </label>
                  <input
                    name="setName"
                    type="text"
                    placeholder="e.g. Temporal Forces, 151..."
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">
                    Rarity
                  </label>
                  <select
                    name="rarity"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                    required
                  >
                    {RARITIES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">
                    Personal Notes
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Any cool story about this pull?"
                    rows={2}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <div className="pt-4">
                  <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-3xl p-6 flex flex-col items-center text-indigo-600 gap-2 mb-6">
                    <Camera size={32} />
                    <span className="text-sm font-bold">Add Photo Proof</span>
                    <span className="text-[10px] uppercase font-black opacity-60">
                      Optional but awards XP
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    SAVE PULL & EARN REWARDS
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex justify-between items-center safe-area-bottom">
        {[
          { id: "explore", icon: MapPin, label: "Explore" },
          { id: "collection", icon: LayoutGrid, label: "Catalog" },
          { id: "challenges", icon: Trophy, label: "Routes" },
          { id: "profile", icon: User, label: "Profile" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === id ? "text-indigo-600 scale-110" : "text-slate-400"}`}
          >
            <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase">{label}</span>
          </button>
        ))}
      </nav>

      <style jsx global>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 1rem); }
      `}</style>
    </div>
  );
}
