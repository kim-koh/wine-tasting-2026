'use client'
import React, { useEffect, useState } from "react";
// Components
import WineDetailPanel from "./WineDetailPanel/WineDetailPanel";
import Image from "next/image";
// Hooks
import { useParty } from "@/hooks/EventStateProvider";
// Icons
import WineGlassIcon from '@/public/icons/wine-glass-icon.png';
import WineDoneCheckmark from '@/public/icons/wine-done-check.png';
import PlaceholderWineImage from '@/public/mystery bottle.jpg'; 
// Types
import { WineCardDataType } from "@/graphql/getAllWines";
// CSS
import "./WineCard.css";

interface WineCardProps {
  data: WineCardDataType;
}

const WineCard: React.FC<WineCardProps> = ({ data }) => {
  const { varietals, wineName, winery, year, color, picture } = data;
  const storageKey = `wine-notes:${winery}:${wineName}:${year}`;  
  const { partyStateLocal } = useParty();
  const [showWineBottle, setShowWineBottle] = useState(() => {
    return partyStateLocal !== "During event (hide wine images)" && partyStateLocal !== "Before event start";
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const [tasted, setTasted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) !== null;
  });
  const cleanVarietals = varietals.map((v) => v.text.replace(/\\n/g, "").trim()).filter(Boolean);
  return (
    <>
      <article className="wine-card" onClick={() => setPanelOpen(true)} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setPanelOpen(true)}>
        <div className="wine-card__image-wrapper">
          <img src={showWineBottle ? picture.url : PlaceholderWineImage.src} alt={`${wineName} bottle`} className="wine-card__image" />
          <div className="wine-card__image-overlay" />
          <span className="wine-card__year">{year}</span>
          {tasted && <span className="wine-card__done-badge">
            <Image src={WineGlassIcon} alt="Wine Glass Icon" className="wine-card__wine-glass-icon"/>
            <Image src={WineDoneCheckmark} alt="Tasted Checkmark" className="wine-card__done-checkmark" />
          </span>}
        </div>
 
        <div className="wine-card__body">
          <div className="wine-card__meta">
            <span className="wine-card__color-badge" data-color={color.toLowerCase()}>
              <span className="wine-card__color-dot" />
              {color}
            </span>
            <span className="wine-card__winery">{winery}</span>
          </div>
 
          <h2 className="wine-card__name">{wineName}</h2>
          <div className="wine-card__divider" />
 
          <div className="wine-card__varietals">
            <p className="wine-card__varietals-label">Blend</p>
            <p className="wine-card__varietals-preview">
              {cleanVarietals.join(" • ")}
            </p>
          </div>
        </div>
      </article>
 
      {panelOpen && <WineDetailPanel data={data} storageKey={storageKey} showWineBottle={showWineBottle} onRated={() => setTasted(true)} onClose={() => setPanelOpen(false)}/>}
    </>
  );
};
 
export default WineCard;