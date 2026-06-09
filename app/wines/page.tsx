// GraphQL
import { clientApollo } from "@/graphql/apolloClient";
import { GET_ALL_WINES, GetAllWinesQueryReturn } from '@/graphql/getAllWines';
// Components
import BurgerMenu from "@/Components/BurgerMenu/BurgerMenu";
import WineCardsSection from "@/Components/WineCardsSection/WineCardsSection";
// CSS
import "./page.css"

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

export default async function WinesPage() {
    const allWinesData = await getWinesData()
    return (
      <div id="wines-page">
        <BurgerMenu className='nav-menu'/>
        <WineCardsSection className="main-content-container" allWinesData={allWinesData} />      
      </div>

    )
}