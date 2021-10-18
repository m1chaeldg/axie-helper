import axios from "axios";
import { POSTGetAxieDetails } from '../types';

export const fetchData = async (
    query: string,
    variables: { [key: string]: any }
) => {
    const { data } = await axios.post(
        'https://graphql-gateway.axieinfinity.com/graphql',
        {
            query,
            variables,
        }
    );

    return data;
};

