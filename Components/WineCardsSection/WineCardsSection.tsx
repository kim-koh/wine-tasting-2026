import React from "react";
import WineCard from "./WineCard/WineCard";
import { WineCardDataType } from "@/graphql/getAllWines";
import '@/app/page.css'; 
import "./WineCardsSection.css"

type WineCardsSectionProps = {
  className?: string; 
  allWinesData?: Array<WineCardDataType> | null;
};

const WineCardsSection: React.FC<WineCardsSectionProps> = ({ className, allWinesData }) => {
  return (
    <section className={`wine-cards-section-wrapper ${className}`}>
        <div className='wine-cards__header'>
          <h1 className='wine-cards__header__title'>TheWines</h1>
          <p className="wine-cards__header__subtitle">Click on a wine card to view more details, rate, and take notes.</p>          
        </div>
        <section className="wine-cards__cards-section">
            {allWinesData?.map((wine, index) => (
                <WineCard
                    key={`${wine.wineName ?? 'wine'}-${index}`}
                    data={wine}
                />
            ))}
        </section>
    </section>
  ); 
}

export default WineCardsSection;