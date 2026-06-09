import { gql } from '@apollo/client'

export type Maybe<T> = T | null

export interface AllergenCardPicture {
    url: string
    alt: Maybe<string>
}

export interface AllergenCard {
    name: string
    picture: Maybe<AllergenCardPicture>
    type: string
    category: Maybe<string>
    veg: Maybe<string>
    description: Maybe<string>
    allergenInformation: Maybe<string>
}

export interface GetAllAllergenCardsQuery {
    allergenCards: AllergenCard[]
}

export type GetAllAllergenCardsQueryVariables = Record<string, never>

export const GET_ALL_ALLERGEN_CARDS = gql`
query getAllAllergenCards {
  allergenCards {
    name
    picture {
      url
      alt
    }
    type
    category
    veg
    description
    allergenInformation
  }
}
`