'use client';
import { setPartyState, getPartyState as getPartyStateLive } from "@/lib/partyStateStore";
import { get } from "http";
import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from "react";

const PARTY_STATES = {
  beforeEvent: "Before event start",
  duringEventHideWineImages: "During event (hide wine images)",
  duringEventShowWineImages: "During event (show wine images)",
  afterEvent: "After event",
} as const;

export type PartyState = (typeof PARTY_STATES)[keyof typeof PARTY_STATES];

const COUNTDOWN_STATE_STORAGE_KEY = "countdownState";

type PartyContextValue = {
  partyStateLocal: PartyState;
  setPartyStateLocal: (state: PartyState) => void;
  partyStateLive: PartyState;
  getPartyStateLive: () => PartyState;
  updatePartyStateLive: (state: PartyState) => void;
  PARTY_STATES: typeof PARTY_STATES;

  countdownState: 'default' | 'forceDone';
  setCountdownState: (state: 'default' | 'forceDone') => void;
};

const PartyContext = createContext<PartyContextValue | null>(null);

type PartyProviderProps = {
  children: ReactNode;
  initialState?: PartyState;
};

export function PartyProvider({ children, initialState = PARTY_STATES.beforeEvent }: PartyProviderProps) {
  // Party state management with localStorage persistence
  const [partyStateLive, setPartyStateLive] = useState<PartyState>(initialState);
  const [partyStateLocal, setPartyStateLocal] = useState<PartyState>(partyStateLive || initialState);

  // Update party state on server and locally (optimistic)
  async function updatePartyStateLive(state: PartyState) {
    setPartyStateLocal(state); // optimistic   
    await fetch('/api/party-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partyState: state }),
    });
    setPartyStateLive(state); // update live state after server confirms
  }

  // shared party state: initial fetch + polling
  useEffect(() => {
    const es = new EventSource("/api/party-state/stream");
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.partyState) {
          setPartyState(data.partyState as PartyState);
          setPartyStateLive(data.partyState as PartyState);
        }
      } catch {
        // ignore malformed events
      }
    };
    es.onerror = () => {
      // optional: add fallback polling here if desired
    };
    return () => es.close();
  }, []);

  // Keep local up to date with live updates
  useEffect(() => {
    if (partyStateLive !== partyStateLocal)
    setPartyStateLocal(partyStateLive);
  }, [partyStateLive]);

  // Countdown override state for testing/admin purposes
  const [countdownState, setCountdownState] = useState<'default' | 'forceDone'>(() => {
    if (typeof window === "undefined") return 'default';
    const saved = localStorage.getItem(COUNTDOWN_STATE_STORAGE_KEY) as 'default' | 'forceDone' | null;
    return saved ?? 'default';
  });

  useEffect(() => {
    localStorage.setItem(COUNTDOWN_STATE_STORAGE_KEY, countdownState);
  }, [countdownState]);


  const value = {
    // Overall event state
    partyStateLocal,
    setPartyStateLocal,
    partyStateLive,
    getPartyStateLive,
    updatePartyStateLive,
    PARTY_STATES,

    // Countdown override state for testing/admin purposes
    countdownState,
    setCountdownState,
  };

  return <PartyContext.Provider value={value}>{children}</PartyContext.Provider>;
}

export function useParty() {
  const ctx = useContext(PartyContext);
  if (!ctx) throw new Error("useParty must be used within a <PartyProvider>");
  return ctx;
}

export { PARTY_STATES };