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
    matronClass: string;
    breedCount: number;
    stage: number;
    ownerProfile: {
        name: string;
    };
    parts: {
        id: string;
        name: string;
        class: string;
        type: string;
        specialGenes: null;
        abilities: {
            id: number;
            name: string;
            attack: number;
            defense: number;
            energy: number;
            description: string;
            backgroundUrl: string;
            effectIconUrl: string;
        }[];
        __typename: string;
    }[];
    stats: {
        hp: number;
        speed: number;
        skill: number;
        morale: number;
    };
};
