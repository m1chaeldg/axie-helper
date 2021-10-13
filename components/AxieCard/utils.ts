import { POSTGetAxieDetails } from "../../types";

export const constructFindSimilarQueries = (
    axieDetails: POSTGetAxieDetails,
    breedCount?: number
) => {
    const baseUrl = 'https://axie.zone/finder?search=';

    const classQuery = `class:${axieDetails.class?.toLowerCase()};`;
    const partQuery =
        'part:' +
        axieDetails.parts
            .map((part) => part.id)
            .filter((_, index) => index > 1)
            .join(',') +
        ';';

    const purityCount = axieDetails.parts.reduce((acc, part) => {
        if (part.class.toLowerCase() === axieDetails.class.toLowerCase()) {
            return acc + 1;
        }

        return acc;
    }, 0);

    const queryBreedCount =
        breedCount === undefined ? axieDetails.breedCount : breedCount;

    const breedCountQuery = `breed_count:${queryBreedCount};`;

    const purityQuery = `purity:${purityCount};`;

    return (
        baseUrl +
        classQuery +
        partQuery +
        purityQuery +
        breedCountQuery +
        'view_genes'
    );
};

export const isBreedableFunc = (
    axie1: POSTGetAxieDetails,
    axie2: POSTGetAxieDetails): { breedable: boolean, reason: string } => {

    //self check
    if (axie1.id == axie2.id) {
        return { breedable: false, reason: '' };
    }
    //parents check
    if (axie2.matronId == axie1.id || axie2.sireId == axie1.id) {
        return { breedable: false, reason: 'Child' };
    }
    if (axie1.matronId == axie2.id || axie1.sireId == axie2.id) {
        return { breedable: false, reason: 'Parent' };
    }
    //After checking parents, skip if ether is a tagged axie
    if (parseInt(axie1.matronId) == 0 || parseInt(axie2.matronId) == 0) {
        return { breedable: true, reason: 'Tag' };
    }
    //check siblings
    if (
        axie1.matronId == axie2.matronId ||
        axie1.matronId == axie2.sireId
    ) {
        return { breedable: false, reason: 'Siblings' };
    }
    if (axie1.sireId == axie2.matronId || axie1.sireId == axie2.sireId) {
        return { breedable: false, reason: 'Siblings' };
    }
    return { breedable: true, reason: '' };
}
