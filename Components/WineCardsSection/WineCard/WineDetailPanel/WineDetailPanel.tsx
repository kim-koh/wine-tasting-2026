import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
// Components
import Image from "next/image";
import { WineCardDataType } from "@/graphql/getAllWines";
import StarRating from "../StarRating/StarRating";
// Icons
import PlaceholderWineImage from '@/public/mystery bottle.jpg';
import HideIcon from "@/public/icons/hide-icon.png"
import ShowIcon from "@/public/icons/show-icon.png"
// CSS
import "./WineDetailPanel.css";

interface DetailPanelProps {
  data: WineCardDataType;
  storageKey: string;
  showWineBottle: boolean;
  onRated: () => void;
  onClose: () => void;
}

interface WineNotes {
  overall: number; 
  freeText: string;
}
 
const WineDetailPanel: React.FC<DetailPanelProps> = ({ data, storageKey, showWineBottle, onRated, onClose }) => {
  const { varietals, wineName, winery, year, color, picture, alcoholContent, description, origin } = data;
  const cleanVarietals = varietals.map((v) => v.text.replace(/\\n/g, "").trim()).filter(Boolean);
  
  const [notes, setNotes] = useState<WineNotes>({
    overall: 0,
    freeText: "",
  });
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [showDescription, setShowDescription] = useState(false);
 
  useEffect(() => {
    setMounted(true);
  }, []);

  // load previously saved notes for this wine
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as WineNotes;
      setNotes({
        overall: Number(parsed?.overall ?? 0),
        freeText: String(parsed?.freeText ?? ""),
      });
      setSaved(true);
    } catch (e) {
      console.error("Failed to read wine notes:", e);
    }
  }, [mounted, storageKey]);

  // trap scroll behind panel
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);
 
  // close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };
 
  /* FUNCTIONS */
  const setRating = (key: keyof WineNotes, val: number) => {
    setSaved(false);
    setNotes((n) => ({ ...n, [key]: val }));
  };
 
  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
      setSaved(true);
      onClose(); // Close panel after saving
      notes.overall > 0 && onRated();      
    } catch (e) {
      console.error("Failed to save wine notes:", e);
    }
  };
  /* END FUNCTIONS */

  if (!mounted) return null; 
 
  return createPortal(
    <div className="panel-backdrop" onClick={handleBackdropClick}>
      <div className="panel" ref={panelRef} role="dialog" aria-modal="true" aria-label={wineName}>
 
        {/* Header */}
        <div className="panel__header">
          <button className="panel__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
 
        {/* Hero */}
        <div className="panel__hero">
          <img src={showWineBottle ? picture.url : PlaceholderWineImage.src} alt={`${wineName} bottle`} className="panel__image" />
          <div className="panel__hero-info">
            <div className="panel__hero-left">
              <div className="panel__meta">
                <span className="wine-card__color-badge" data-color={color.toLowerCase()}>
                  <span className="wine-card__color-dot" />
                  {color}
                </span>
              </div>
              <h2 className="panel__name">{wineName}</h2>
              <p className="panel__winery">{winery}</p>
              <p className="panel__origin">{origin}</p>
            </div>
            <div className="panel__hero-right">
              <p className="panel__year">{year}</p>
              <p className="panel__alcohol">{alcoholContent} ABV</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="panel__description-container">
          <span className="panel__description-title-container">
            <h3 className="panel__description-title">Description</h3>
            {showDescription ? <Image
              src={HideIcon}
              alt={showDescription ? "Hide description" : "Show description"}
              className="panel__description-title-icon"
              onClick={() => setShowDescription((prev) => !prev)}
            /> : <Image
              src={ShowIcon}
              alt={showDescription ? "Hide description" : "Show description"}
              className="panel__description-title-icon"
              onClick={() => setShowDescription((prev) => !prev)}
            />}
          </span>
          <p className={`panel__description ${showDescription ? "" : "hidden"}`}>
            {showDescription ? description :
              "Form your own opinion first. Click the eye icon to view."
            }
          </p>
        </div>
 
        <div className="panel__divider" />
 
        {/* Varietals */}
        <section className="panel__section">
          <h3 className="panel__section-title">Blend</h3>
          <ul className="panel__varietals">
            {cleanVarietals.map((v, i) => (
              <li key={i} className="panel__varietal">
                <span className="panel__varietal-index">{String(i + 1).padStart(2, "0")}</span>
                {v}
              </li>
            ))}
          </ul>
        </section>
 
        <div className="panel__divider" />
 
        {/* Notes */}
        <section className="panel__section">
          <h3 className="panel__section-title">My Notes</h3>
 
          <div className="panel__ratings">
            <StarRating label="Overall"  value={notes.overall} onChange={(v) => setRating("overall", v)} />
          </div>
 
          <textarea
            className="panel__notes-input"
            placeholder="Add tasting notes, food pairings, occasions…"
            value={notes.freeText}
            rows={4}
            onChange={(e) => { setSaved(false); setNotes((n) => ({ ...n, freeText: e.target.value })); }}
          />
 
          <button
            disabled={notes.overall === 0 && notes.freeText.trim() === ""}
            className={`panel__save-btn ${saved ? "panel__save-btn--saved" : ""}`}
            onClick={handleSave}
          >
            {saved ? "✓ Saved" : "Save Notes"}
          </button>
        </section>
 
      </div>
    </div>,
    document.body
  );
};

export default WineDetailPanel;