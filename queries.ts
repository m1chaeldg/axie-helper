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
        breedCount
        image
        title
        battleInfo {
            banned
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
            __typename 
        }
        __typename
    }
    `;
