'use client'
import React from "react";
// Types
import { AllergenCard } from "@/graphql/getAllAllergenCards";
// CSS
import "./DietaryInfoCard.css";

const categoryToDisplayName = {
    appetizer: 'Appetizer',
    main: 'Main',
    dessert: 'Dessert',
    nAMocktail: 'N/A Drink',
    thcDrink: 'THC Drink',
    alcoholicBeverage: 'Alc Drink'
} as const;

type DietaryCategory = keyof typeof categoryToDisplayName;

const getCategoryDisplayName = (category?: string | null) => {
    if (!category) return '';
    return category in categoryToDisplayName
        ? categoryToDisplayName[category as DietaryCategory]
        : category;
};

interface DietaryInfoCardProps {
    data: AllergenCard;
}

const DietaryInfoCard: React.FC<DietaryInfoCardProps> = ({ data }) => {
    const { name, picture, category, veg, description, allergenInformation } = data;

    return (
        <>
            <article className="dietary-card" role="button" tabIndex={0}>
                <div className="dietary-card__image-wrapper">
                    {picture && <img src={picture.url} alt={picture.alt || `${name} image`} className="dietary-card__image" />}
                    <div className="dietary-card__image-overlay" />
                    {veg && <span className="dietary-card__veg">{veg}</span>}
                </div>

                <div className="dietary-card__body">
                    <div className="dietary-card__header">
                        <h2 className="dietary-card__name">{name}</h2>
                        {category && <span className="dietary-card__category">{getCategoryDisplayName(category)}</span>}
                    </div>
                    <div className="dietary-card__divider" />
                    <div className="dietary-card__bottom">
                        <p className="dietary-card__description">{description}</p>
                        <div className="dietary-card__allergen-section">
                            <p className="dietary-card__allergen-info-label">Allergens</p>
                            <p className="dietary-card__allergen-info">{allergenInformation}</p>
                        </div>                        
                    </div>
                </div>
            </article>
        </>
    );
};

export default DietaryInfoCard;