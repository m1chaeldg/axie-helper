import React, { useMemo, useState } from 'react';
import classnames from 'classnames/bind';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { AxieGene } from 'agp-npm/dist/axie-gene';
import Image from 'next/image';
import { Chip } from '@mui/material';
import { format } from 'date-fns';
import GeneTable from '../GeneTable';
import { POSTGetAxieDetails } from '../../types';

import styles from './AxieCard.module.scss';
import {constructFindSimilarQueries} from "./utils";

const cx = classnames.bind(styles);

type AxieCardProps = {
    axieDetails: POSTGetAxieDetails;
    handleSelectToCompare?: (axie: POSTGetAxieDetails) => void;
    breedPair: POSTGetAxieDetails[];
};

const deriveHatchDateTime = (unixTimestamp: number) => {
    const daysInMs = (days: number) => days * 24 * 60 * 60 * 1000;
    return format(
        new Date(unixTimestamp * 1000 + daysInMs(5)),
        'dd-mm-yyyy h:mm b'
    );
};
const AxieCard: React.FC<AxieCardProps> = ({
    axieDetails,
    handleSelectToCompare,
    breedPair,
}) => {
    const isEgg = axieDetails.genes === '0x0';

    const decodeGene = (geneHex: string) => {
        return new AxieGene(geneHex);
    };



    const isSelected = useMemo(
        () =>
            breedPair.findIndex((selected) => selected.id === axieDetails.id) >
            -1,
        [breedPair]
    );

    return (
        <div className={cx('container')}>
            <div className={cx('title-container')}>
                <div className={cx('title')}>
                    <a
                        href={`https://marketplace.axieinfinity.com/axie/${axieDetails.id}`}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        <h3>{axieDetails.name}</h3>
                        <OpenInNewOutlinedIcon />
                    </a>
                </div>
                <Chip label={`#${axieDetails.id}`} />
            </div>
            {!isEgg && (
                <div className={cx('data-container')}>
                    <div>
                        Gene Quality:&nbsp;
                        {decodeGene(axieDetails.genes)?.getGeneQuality()}%
                    </div>
                    <div>Breed Count: {axieDetails.breedCount}</div>
                </div>
            )}
            <div>
                Birth Date:{' '}
                {format(new Date(axieDetails.birthDate * 1000), 'dd-mm-yyyy')}
            </div>
            {isEgg && (
                <div>
                    Hatch Date: {deriveHatchDateTime(axieDetails.birthDate)}
                </div>
            )}
            <div className={cx('content-container')}>
                <Image
                    src={axieDetails.image}
                    width={200}
                    height={150}
                    alt="image of axie"
                />

                {!isEgg && <GeneTable genes={decodeGene(axieDetails.genes)} />}
            </div>

            {handleSelectToCompare && !isEgg && (
                <button onClick={() => handleSelectToCompare(axieDetails)}>
                    {isSelected ? 'Remove' : 'Select'}
                </button>
            )}

            {!isEgg && (
                <div className={cx('link-container')}>
                    <a
                        href={constructFindSimilarQueries(axieDetails)}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Look for exact same parts
                    </a>

                    <a
                        href={constructFindSimilarQueries(axieDetails, 0)}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Look for 0 breed count
                    </a>
                </div>
            )}
        </div>
    );
};

export default AxieCard;
