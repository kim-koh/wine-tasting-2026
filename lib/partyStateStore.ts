export const PARTY_STATES = {
  beforeEvent: "Before event start",
  duringEventHideWineImages: "During event (hide wine images)",
  duringEventShowWineImages: "During event (show wine images)",
  afterEvent: "After event",
} as const;

export type PartyState = (typeof PARTY_STATES)[keyof typeof PARTY_STATES];

let partyState: PartyState = PARTY_STATES.afterEvent;
const listeners = new Set<(state: PartyState) => void>();

export function getPartyState() {
  return partyState;
}

export function setPartyState(partyStateToStart: PartyState) {
  partyState = partyStateToStart;
  listeners.forEach((cb) => cb(partyState));
}

export function subscribePartyState(cb: (state: PartyState) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}