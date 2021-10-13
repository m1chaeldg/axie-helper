import React, { useState } from 'react';
import classnames from 'classnames/bind';
import PriceTracker from '../../components/PriceTracker';

import styles from './playground.module.scss';
import { TextField } from '@mui/material';
import AxieCard from '../../components/AxieCard';
import { POSTGetAxieDetails } from '../../types';
import { fetchData } from '../../common/utils';
import Layout from '../../components/Layout';

const cx = classnames.bind(styles);

const Playground: React.FC = () => {
    const [axieDetails, setAxieDetails] = useState<POSTGetAxieDetails>();
    const [axieId, setAxieId] = useState('');

    const handleGetAxieDetails = async () => {
        console.log(axieId);
        try {
            const data = await fetchData(
                `query GetAxieDetail($axieId: ID!) {
                        axie(axieId: $axieId) {
                            ...AxieDetail    
                            __typename  
                        }   
                    }
                    fragment AxieDetail on Axie {
                        id
                        image
                        class
                        chain
                        name
                        genes
                        owner  
                        birthDate  
                        bodyShape  
                        class  
                        sireId  
                        sireClass  
                        matronId  
                        parts {
                            id
                            name
                            class
                            type
                            specialGenes
                            __typename 
                        }
                    }
               
                    `,
                {
                    axieId,
                }
            );

            console.log(data);
            setAxieDetails(data.data.axie);
        } catch (err) {
            console.log(err);
        }
    };
    console.log(axieDetails);

    return (
        <Layout>
            <div className={cx('container')}>
                <div className={cx('axie-id-input')}>
                    <TextField
                        label="Axie Id"
                        variant="outlined"
                        onChange={(e) => setAxieId(e.target.value)}
                        className={cx('input')}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleGetAxieDetails}
                    >
                        Get Axie Details
                    </button>
                </div>

                {axieDetails && (
                    <AxieCard axieDetails={axieDetails} breedPair={[]} />
                )}
            </div>
        </Layout>
    );
};

export default Playground;
