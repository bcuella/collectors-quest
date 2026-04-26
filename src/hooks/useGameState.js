import { useState, useEffect, useCallback } from "react";
import { TRAINER_TITLES } from "../data/appData";

// v3 key — clears all old cached Seattle/Bellevue state on load
const STORAGE_KEY = "pva_state_v3";

const INITIAL_STATE = {
  xp: 0,
  coins: 0,
  level: 1,
  streak: 1,
  lastLogDate: null,
  collection: [],
  wishlist: [],
  machineNotes: {},
  badges: [],
  steps: 4230,
  partnerMode: false,
  completedChallenges: [],
  quests: [
    {
      id: "q1",
      text: "Visit 2 different machines",
      progress: 0,
      total: 2,
      completed: false,
      rewardXP: 50,
      rewardCoins: 20,
    },
    {
      id: "q2",
      text: "Log 1 pull with photo proof",
      progress: 0,
      total: 1,
      completed: false,
      rewardXP: 30,
      rewardCoins: 10,
    },
    {
      id: "q3",
      text: "Complete 1 walk challenge",
      progress: 0,
      total: 1,
      completed: false,
      rewardXP: 100,
      rewardCoins: 50,
    },
  ],
};

export function useGameState() {
  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      // Purge every old key so stale data never appears
      [
        "pokemon_vending_adventure_state",
        "pokemon_vending_adventure_state_v2",
        "pva_state_v2",
      ].forEach((k) => localStorage.removeItem(k));
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    }
    return INITIAL_STATE;
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addXP = useCallback((amount) => {
    setState((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      if (newLevel > prev.level)
        setNotification({ type: "level_up", value: newLevel });
      return { ...prev, xp: newXP, level: newLevel };
    });
  }, []);

  const addCoins = useCallback((amount) => {
    setState((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const logPull = useCallback(
    (pullData) => {
      const xpReward = calculateXP(pullData.productType, pullData.rarity);
      const coinReward = 15;
      setState((prev) => {
        const newCollection = [
          {
            ...pullData,
            id: Date.now().toString(),
            date: new Date().toISOString(),
          },
          ...prev.collection,
        ];
        const newQuests = prev.quests.map((q) => {
          if (q.id === "q2" && !q.completed) {
            const p = q.progress + 1;
            return { ...q, progress: p, completed: p >= q.total };
          }
          return q;
        });
        const newBadges = [...prev.badges];
        if (!newBadges.includes("first_pull")) newBadges.push("first_pull");
        if (pullData.productType === "ETB" && !newBadges.includes("etb_hunter"))
          newBadges.push("etb_hunter");
        if (
          pullData.rarity === "Secret Rare" &&
          !newBadges.includes("secret_finder")
        )
          newBadges.push("secret_finder");
        return {
          ...prev,
          collection: newCollection,
          quests: newQuests,
          badges: newBadges,
        };
      });
      addXP(xpReward);
      addCoins(coinReward);
      setNotification({ type: "reward", xp: xpReward, coins: coinReward });
    },
    [addXP, addCoins],
  );

  const toggleWishlist = useCallback((machineId) => {
    setState((prev) => {
      const isWishlisted = prev.wishlist.includes(machineId);
      return {
        ...prev,
        wishlist: isWishlisted
          ? prev.wishlist.filter((id) => id !== machineId)
          : [...prev.wishlist, machineId],
      };
    });
  }, []);

  const updateMachineNote = useCallback((machineId, note) => {
    setState((prev) => ({
      ...prev,
      machineNotes: { ...prev.machineNotes, [machineId]: note },
    }));
  }, []);

  const togglePartnerMode = useCallback(() => {
    setState((prev) => ({ ...prev, partnerMode: !prev.partnerMode }));
  }, []);

  const completeChallenge = useCallback(
    (challengeId, xp, coins) => {
      setState((prev) => {
        if (prev.completedChallenges.includes(challengeId)) return prev;
        const newQuests = prev.quests.map((q) =>
          q.id === "q3" && !q.completed
            ? { ...q, progress: 1, completed: true }
            : q,
        );
        const newBadges = [...prev.badges];
        if (!newBadges.includes("mile_walker")) newBadges.push("mile_walker");
        return {
          ...prev,
          completedChallenges: [...prev.completedChallenges, challengeId],
          quests: newQuests,
          badges: newBadges,
        };
      });
      addXP(xp);
      addCoins(coins);
      setNotification({ type: "reward", xp, coins });
    },
    [addXP, addCoins],
  );

  const simulateSteps = useCallback(() => {
    setState((prev) => {
      const newSteps = Math.min(
        10000,
        prev.steps + Math.floor(Math.random() * 500) + 200,
      );
      const newBadges = [...prev.badges];
      if (newSteps >= 10000 && !newBadges.includes("10k_steps"))
        newBadges.push("10k_steps");
      return { ...prev, steps: newSteps, badges: newBadges };
    });
  }, []);

  const getTrainerTitle = () => {
    let title = TRAINER_TITLES[0].title;
    for (const t of TRAINER_TITLES) {
      if (state.level >= t.level) title = t.title;
    }
    return title;
  };

  return {
    state,
    logPull,
    toggleWishlist,
    updateMachineNote,
    togglePartnerMode,
    completeChallenge,
    simulateSteps,
    getTrainerTitle,
    notification,
    clearNotification: () => setNotification(null),
  };
}

function calculateXP(productType, rarity) {
  let base = 20;
  if (productType === "ETB") base = 100;
  else if (productType === "Booster Bundle") base = 50;
  else if (productType === "Mini Tin") base = 30;
  let bonus = 0;
  if (rarity === "Holo") bonus = 10;
  else if (rarity === "Ultra Rare") bonus = 30;
  else if (rarity === "Illustration Rare") bonus = 50;
  else if (rarity === "Secret Rare") bonus = 100;
  return base + bonus;
}
