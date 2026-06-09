import { gql } from '@apollo/client'

export type GetAllWinesQueryReturn = {
    wineCards: Array<WineCardDataType> | null
}

export type WineCardDataType = {
    varietals: Array<{
        text: string 
    }> 
    wineName: string 
    winery: string 
    year: number
    color: string 
    origin: string
    alcoholContent: string
    description?: string
    picture: {
        url: string 
        alt?: string
    }
}

export const GET_ALL_WINES = gql`
query getAllWines {
  wineCards(first: 50) {
    varietals {
      text
    }
    wineName
    winery
    year
    color
    origin
    alcoholContent
    description
    picture {
      url
      alt
    }
  }
}
`

