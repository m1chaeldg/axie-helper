import {POSTGetAxieDetails} from "../../types";

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