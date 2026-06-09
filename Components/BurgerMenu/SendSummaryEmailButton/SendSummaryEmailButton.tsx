'use client';
import { useState, type MouseEvent } from "react";
// GraphQL 
import { clientApollo } from "@/graphql/apolloClient";
import { GET_ALL_WINES, GetAllWinesQueryReturn, WineCardDataType } from '@/graphql/getAllWines';
// CSS
import "@/app/globals.css";
import "./SendSummaryEmailButton.css"

// Get wine data from hygraph
export async function getWinesData() {
    try {
        const winesData = await clientApollo.query<GetAllWinesQueryReturn>({
            query: GET_ALL_WINES,
        })
        if (winesData) {
            return winesData.data?.wineCards;
        }
        else return null;
    } catch (err) {
        console.error(err)
        return null;
    }
}

// Helper function to build the localStorage key for a given wine
function getWineKey(wine: WineCardDataType) {
    return `wine-notes:${wine.winery}:${wine.wineName}:${wine.year}`;
}

// Get user's ratings from localStorage
function getLocalRatings(wines: WineCardDataType[]) {
    const ratings: Record<string, { rating?: number; notes?: string }> = {};

    for (const wine of wines) {
        const wineKey = getWineKey(wine);
        const raw = localStorage.getItem(wineKey);
        if (!raw) continue;

        try {
            const parsed = JSON.parse(raw) as {
                overall?: number;   // current shape
                freeText?: string;  // current shape
                rating?: number;    // backward compatibility
                notes?: string;     // backward compatibility
            };

            const rating = Number(parsed.overall ?? parsed.rating ?? 0);
            const notes = String(parsed.freeText ?? parsed.notes ?? "").trim();

            if (rating > 0 || notes.length > 0) {
                ratings[wineKey] = {
                    rating: rating > 0 ? rating : undefined,
                    notes: notes || undefined,
                };
            }
        } catch {
            // ignore bad entry for this wine
        }
    }
    return ratings;
}

function formatVarietals(varietals: WineCardDataType["varietals"]) {
    if (!Array.isArray(varietals)) return "";
    return varietals
        .map((v: any) => (typeof v === "string" ? v : v?.text))
        .filter(Boolean)
        .join(", ");
}

// Build the mailto URI with the wine and rating data
type buildMailtoParams = {
    wines: WineCardDataType[];
    ratings: Record<string, { rating?: number; notes?: string }>;
    photosLink?: string;
    recipientEmail?: string;
};
function buildMailto({ wines, ratings, photosLink, recipientEmail = "" }: buildMailtoParams) {
    const subject = encodeURIComponent("✨Wine Tasting Night✨ — Your Summary");
    const lines: string[] = [];

    lines.push("Hi there!");
    lines.push("");
    lines.push("Here's your personal summary from tonight's wine tasting.");
    lines.push("");

    wines.forEach((wine, i) => {
        const r = ratings[getWineKey(wine)] ?? {};
        const stars = r.rating ? "★".repeat(r.rating) + "☆".repeat(5 - r.rating) : "Not rated";
        const notes = r.notes?.trim() || "No notes added.";
        const varietalText = formatVarietals(wine.varietals);

        lines.push(`${i + 1}. ${wine.wineName}`);
        if (wine.winery) lines.push(`Producer: ${wine.winery}`);
        if (varietalText) lines.push(`Varietal: ${varietalText}`);
        if (wine.year) lines.push(`Vintage: ${wine.year}`);
        if (wine.origin) lines.push(`Region: ${wine.origin}`);
        // remove/shorten long description to keep mailto small
        if (wine.description) lines.push(`About: ${String(wine.description)}`);
        lines.push(`Rating: ${stars}`);
        lines.push(`Notes: ${notes}`);
        lines.push("");
    });

    if (photosLink) {
        lines.push(`Photos: ${photosLink}`);
        lines.push("");
    }

    lines.push("Cheers! 🥂");

    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}

type SendSummaryEmailButtonProps = {
    photosLink?: string;
    className?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
    style?: 'small' | 'extended';
};

export default function SendSummaryEmailButton({
    photosLink = "",
    className = "",
    onClick,
    style = 'extended'
}: SendSummaryEmailButtonProps) {
    const [status, setStatus] = useState("idle"); // idle | loading | error
    const [lastRecipientEmail, setLastRecipientEmail] = useState("");

    async function handleClick(event: MouseEvent<HTMLButtonElement>) {
        setStatus("loading");

        try {
            const wines = (await getWinesData()) ?? [];
            const ratings = getLocalRatings(wines);

            // If user has not rated all wines, confirm before sending
            if (Object.keys(ratings).length < wines.length) {
                const shouldSend = window.confirm(
                    `You have not rated all wines yet (${Object.keys(ratings).length}/${wines.length}).\n\nDo you still want to send the email now?`
                );
                if (!shouldSend) {
                    setStatus("idle");
                    return;
                }
            }

            // Get user's email address
            const enteredEmail = window.prompt(
                "Enter the email address to receive your wine summary:",
                lastRecipientEmail
            );
            if (enteredEmail === null) {
                setStatus("idle");
                return;
            }
            const recipientEmail = enteredEmail.trim();
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail);
            if (!isValidEmail) {
                window.alert("Please enter a valid email address.");
                setStatus("idle");
                return;
            }
            setLastRecipientEmail(recipientEmail);

            const rows = wines.map((wine) => {
                const r = ratings[getWineKey(wine)] ?? {};
                return {
                    wineName: wine.wineName,
                    winery: wine.winery,
                    year: wine.year,
                    origin: wine.origin,
                    varietals: formatVarietals(wine.varietals),
                    pictureUrl: wine.picture?.url,
                    rating: r.rating,
                    notes: r.notes,
                };
            });

            const res = await fetch("/api/send-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientEmail,
                    photosLink,
                    rows,
                }),
            });

            if (!res.ok) throw new Error("send-summary failed");

            await onClick?.(event);
            setStatus("idle");
        } catch (err) {
            console.error("Failed to send summary email:", err);
            setStatus("error");
        }
    }

    return (
        <>
            <button
                className={`send-email-btn ${status === "error" ? "error" : ""} ${className}`}
                type="button"
                onClick={handleClick}
                disabled={status === "loading"}
                aria-busy={status === "loading"}
            >
                <div className="nav-text-container">
                {status === "loading" ? (
                    <span className="spinner" aria-hidden="true" />
                ) : (
                    <span className="nav-icon" aria-hidden="true">
                        {status === "error" ? "⚠️" : "✉️"}
                    </span>
                )}
                {style === 'small' ?
                    <span className="nav-text small">
                        <span className="nav-label small">Email me my tasting notes</span>
                    </span>
                    :
                    <span className="nav-text">
                        <span className="nav-label">Email me </span>
                        <span className="nav-sub">Send me a summary of the wines and my notes.</span>
                    </span>
                }
                </div>
            </button>
        </>
    );
}