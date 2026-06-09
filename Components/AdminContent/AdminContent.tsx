'use client';
import { useState } from "react";
// Hooks
import { useParty, PartyState } from "@/hooks/EventStateProvider";
// CSS
import "./AdminContent.css";

export default function AdminContent() {
    const { PARTY_STATES, setPartyStateLocal, partyStateLocal, updatePartyStateLive, partyStateLive, getPartyStateLive, setCountdownState } = useParty();
    const [password, setPassword] = useState("");
    const isAuthorized = password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || (typeof document !== "undefined" && document.cookie.includes("admin=true"));
    if (isAuthorized) {
        document.cookie = "admin=true; path=/"; // Set cookie to remember authorization
    }
    return (
        <section className="admin-content">
            {!isAuthorized && <div className="admin-content__password-container">
                <label htmlFor="admin-password">Enter password:</label>
                <input

                    id="admin-password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>}
            {isAuthorized && (
                <section className="admin-controls" >
                    <section className="admin-controls-live">
                        <h2>Live Controls</h2>
                        <div className="admin-controls-live__event-mode">
                            <h3 className="admin-controls-live__event-mode__title">Set Party "Mode" (For All Guests)</h3>
                            <p className="admin-controls-live__event-mode__subtitle">Select the current mode for the party. This will change the party state for all guests viewing the site.</p>
                            <select
                                className="admin-controls__event-mode__select"
                                onChange={(e) => updatePartyStateLive(e.target.value as PartyState)}
                                value={partyStateLive}
                            >
                                {Object.values(PARTY_STATES).map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>
                    <section className="admin-controls-test">
                        <h2>Testing Tools</h2>
                        <div className="admin-controls-test__event-mode">
                            <h3 className="admin-controls-test__event-mode__title">Set Party "Mode" (Testing)</h3>
                            <p className="admin-controls-test__event-mode__subtitle">Select the current mode for the party. This is for testing purposes and will only change the party state for you.</p>
                            <select
                                className="admin-controls-test__event-mode__select"
                                onChange={(e) => setPartyStateLocal(e.target.value as PartyState)}
                                value={partyStateLocal}
                            >
                                {Object.values(PARTY_STATES).map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-controls-test__clear-local-storage">
                            <h3 className="admin-controls-test__clear-local-storage__title">Reset Wine Ratings</h3>
                            <p className="admin-controls-test__clear-local-storage__subtitle">If you are testing and need to clean up only your own test notes and ratings, you can reset them here. Will not clear anyone else's notes.</p>
                            <button
                                className="admin-controls-test__clear-local-storage__button"
                                onClick={() => {
                                    localStorage.clear();
                                }}
                            >
                                Clear Local Storage
                            </button>
                        </div>
                        <div className="admin-controls-test__override-countdown">
                            <h3 className="admin-controls-test__override-countdown__title">Override Countdown</h3>
                            <p className="admin-controls-test__override-countdown__subtitle">You can override the countdown timer to see what the page will look like once the event starts. This will not affect anyone else's view of the site, only your own. </p>
                            <select className="admin-controls-test__override-countdown__select"
                                onChange={(e) => setCountdownState(e.target.value as 'default' | 'forceDone')}
                            >
                                <option value="default">Default (Countdown to event start)</option>
                                <option value="forceDone">Force Countdown Done</option>
                            </select>
                        </div>
                    </section>
                </section>
            )}
        </section>
    )
}