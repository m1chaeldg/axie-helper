export type POSTGetAxieDetails = {
    id: string;
    image: string;
    class: string;
    chain: string;
    name: string;
    genes: string;
    owner: string;
    birthDate: number;
    bodyShape: string;
    sireId: string;
    sireClass: string;
    matronId: string;
    breedCount: number;
    stage: number;
    parts: {
        id: string;
        name: string;
        class: string;
        type: string;
        specialGenes: null;
        __typename: string;
    }[];
};
