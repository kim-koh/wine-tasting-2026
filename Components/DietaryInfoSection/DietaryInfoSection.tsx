'use client'
import { useState } from 'react'
// Components
import DietaryInfoCard from './DietaryInfoCard/DietaryInfoCard'
// Types
import { AllergenCard } from '@/graphql/getAllAllergenCards'
// CSS
import '@/app/page.css'
import './DietaryInfoSection.css'

type DietaryInfoSectionProps = {
    dietaryInfo: AllergenCard[] | null
}

export default function DietaryInfoSection({ dietaryInfo }: DietaryInfoSectionProps) {
    const [activeTab, setActiveTab] = useState<'bites' | 'bevs'>('bites')
    const allDrinkItems: AllergenCard[] = dietaryInfo?.filter(card => card.type === 'beverage') ?? []
    const allFoodItems: AllergenCard[] = dietaryInfo?.filter(card => card.type === 'food') ?? []
    const itemsToDisplay = activeTab === 'bites' ? allFoodItems : allDrinkItems
    return (
        <section className='main-content-container dietary-page__main-container'>
            <div className='dietary-page__header'>
                <h1 className="dietary-page__title">Dietary Info</h1>
                <p className='dietary-page__subtitle'>Learn about dietary and allergen information for the foods and beverages.</p>               
            </div>
            <section className='dietary-page__body-content'>
                <div className='dietary-page__tabs'>
                    <button 
                        className={activeTab === 'bites' ? 'active' : ''} 
                        onClick={() => setActiveTab('bites')}
                    >
                        Bites
                    </button>
                    <button 
                        className={activeTab === 'bevs' ? 'active' : ''} 
                        onClick={() => setActiveTab('bevs')}
                    >
                        Bevs
                    </button>
                </div>
                <div className='dietary-page__cards-container'>
                    {itemsToDisplay?.map((allergenCard, index) => (
                        <DietaryInfoCard key={`${allergenCard.name ?? 'allergen'}-${index}`} data={allergenCard} />
                    ))}
                </div>
            </section>

        </section>
    )
}