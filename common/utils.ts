import axios from "axios";
import { POSTGetAxieDetails } from '../types';

export const fetchData = async (
    query: string,
    variables: { [key: string]: any }
) => {
    const { data } = await axios.post(
        'https://axieinfinity.com/graphql-server-v2/graphql',
        {
            query,
            variables,
        }
    );

    return data;
};

export const isBreedableFunc = (
    axie1: POSTGetAxieDetails,
    axie2: POSTGetAxieDetails): { breedable: boolean, reason: string } => {

    console.log({ axie1, axie2 });

    //self check
    if (axie1.id == axie2.id) {
        console.log({ self_check: false });
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
        console.log({
            matronId1: parseInt(axie1.matronId),
            matronId2: parseInt(axie2.matronId),
            check: true,
        });
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
