// GraphQL
import { clientApollo } from '@/graphql/apolloClient';
import { GET_ALL_ALLERGEN_CARDS, GetAllAllergenCardsQuery } from '@/graphql/getAllAllergenCards';
// Components
import BurgerMenu from '@/Components/BurgerMenu/BurgerMenu';
import DietaryInfoSection from '@/Components/DietaryInfoSection/DietaryInfoSection';
// CSS
import './page.css';

export async function getAllDietaryInfo() {
  try {
    const allergenCardsData = await clientApollo.query<GetAllAllergenCardsQuery>({
      query: GET_ALL_ALLERGEN_CARDS,
    })
    if (allergenCardsData) {
      return allergenCardsData.data?.allergenCards;
    }
    else return null; 
  } catch (err) {
    console.error(err)
    return null; 
  }
}

export default async function FoodsPage() {
    const allDietaryInfo = await getAllDietaryInfo()
    return (
        <div className="foods-page">
            <BurgerMenu />
            {allDietaryInfo && <DietaryInfoSection dietaryInfo={allDietaryInfo} />}
        </div>
    )
}