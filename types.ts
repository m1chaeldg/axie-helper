export type POSTGetAxieDetails = {
    id: string;
    image: string;
    class: string;
    chain: string;
    name: string;
    genes: string;
    owner: string;
    birthDate: string;
    bodyShape: string;
    sireId: string;
    sireClass: string;
    matronId: string;
    breedCount: number;
    parts: {
        id: string;
        name: string;
        class: string;
        type: string;
        specialGenes: null;
        __typename: string;
    }[];
};
