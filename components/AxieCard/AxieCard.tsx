import React, { useMemo, useState } from 'react';
import classnames from 'classnames/bind';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { AxieGene } from 'agp-npm/dist/axie-gene';
import Image from 'next/image';
import { Chip, Button, LinearProgress, Stack } from '@mui/material';
import { format, parse } from 'date-fns';
import GeneTable from '../GeneTable';
import { POSTGetAxieDetails } from '../../types';
import { AxieAbilities, AxieParts } from './AxieAbilities';
import { AxieStats } from './AxieStats';

import styles from './AxieCard.module.scss';
import { constructFindSimilarQueries, isBreedableFunc } from './utils';

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
    const isAxie = axieDetails.genes != '0x0';

    const decodeGene = (geneHex: string) => {
        return new AxieGene(geneHex);
    };

    const isSelected = useMemo(
        () =>
            breedPair.findIndex((selected) => selected.id === axieDetails.id) >
            -1,
        [breedPair]
    );

    const { breedable, reason } =
        breedPair.length == 0
            ? { breedable: true, reason: '' }
            : isBreedableFunc(breedPair[0], axieDetails);
    const bc7Below = axieDetails.breedCount < 7;

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
                <Chip color="primary" label={`#${axieDetails.id}`} />
            </div>

            {isAxie && (
                <div className={cx('data-container')}>
                    <div>
                        BC: {axieDetails.breedCount} P:{' '}
                        {decodeGene(axieDetails.genes)?.getGeneQuality()}%
                    </div>
                    <div>Owner: {axieDetails.ownerProfile.name}</div>
                </div>
            )}
            {!isAxie && (
                <div>
                    Hatch Date: {deriveHatchDateTime(axieDetails.birthDate)}
                </div>
            )}
            <div className={cx('content-container')}>
                <Image
                    src={axieDetails.image}
                    width={200}
                    height={150}
                    alt={axieDetails.name}
                />
                <hr></hr>
                {isAxie && <AxieAbilities axieDetails={axieDetails} />}
                <hr></hr>
                {isAxie && <AxieStats axieDetails={axieDetails} />}
                <hr></hr>
                {isAxie && <AxieParts axieDetails={axieDetails} />}
                {isAxie && <GeneTable genes={decodeGene(axieDetails.genes)} />}
            </div>

            {handleSelectToCompare &&
                isAxie &&
                bc7Below &&
                (isSelected || breedable) && (
                    <Button
                        variant={isSelected ? 'contained' : 'outlined'}
                        onClick={() => handleSelectToCompare(axieDetails)}
                    >
                        {isSelected ? 'Remove' : 'Select'}
                    </Button>
                )}
            {handleSelectToCompare && isAxie && !isSelected && !breedable && (
                <Button variant="outlined">Can not Breed: {reason}</Button>
            )}

            {isAxie && (
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
