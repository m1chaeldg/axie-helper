import React, { useMemo, useState } from 'react';
import classnames from 'classnames/bind';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { AxieGene } from 'agp-npm/dist/axie-gene';
import Image from 'next/image';
import { Chip, Button } from '@mui/material';
import { format, parse } from 'date-fns';
import GeneTable from '../GeneTable';
import { POSTGetAxieDetails } from '../../types';

import styles from './AxieCard.module.scss';
import { constructFindSimilarQueries } from './utils';
import { isBreedableFunc } from '../../common/utils';

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

    let { breedable, reason } =
        breedPair.length == 0
            ? { breedable: true, reason: '' }
            : isBreedableFunc(breedPair[0], axieDetails);

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
                        BC: {axieDetails.breedCount}, H: {axieDetails.stats.hp},
                        S: {axieDetails.stats.speed}, M:{' '}
                        {axieDetails.stats.morale}, P:{' '}
                        {decodeGene(axieDetails.genes)?.getGeneQuality()}%
                    </div>
                </div>
            )}

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

            {handleSelectToCompare && !isEgg && (isSelected || breedable) && (
                <Button
                    variant={isSelected ? 'contained' : 'outlined'}
                    onClick={() => handleSelectToCompare(axieDetails)}
                >
                    {isSelected ? 'Remove' : 'Select'}
                </Button>
            )}
            {handleSelectToCompare && !isEgg && !isSelected && !breedable && (
                <Button variant="outlined">Can not Breed: {reason}</Button>
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
