export const getAxieBriefListQuery = `query GetAxieBriefList($auctionType: AuctionType, $from: Int, $sort: SortBy, $size: Int, $owner: String) {
        axies(auctionType: $auctionType, from: $from, sort: $sort, size: $size, owner: $owner) {
        total
        results {
            ...AxieBrief
            __typename
        }
        __typename
        }
    }
                                  
    fragment AxieBrief on Axie {
        id  
        name
        stage
        class
        genes
        sireId
        sireClass
        matronId
        matronClass
        breedCount
        image
        title
        birthDate
        battleInfo {
            banned
            __typename
        }
        ownerProfile {
            name
            __typename
        }
        auction {
            currentPrice
            currentPriceUSD
            __typename
        }
        parts {
            id
            name
            class
            type
            specialGenes
            abilities {
                ...AxieCardAbility
                __typename
            }
            __typename 
        }
        stats {
            ...AxieStats
            __typename
        }
        __typename
    }
    fragment AxieStats on AxieStats {
        hp
        speed
        skill
        morale
        __typename
    }
    fragment AxieCardAbility on AxieCardAbility {
        id
        name
        attack
        defense
        energy
        description
        backgroundUrl
        effectIconUrl
        __typename
    }
    `;
      