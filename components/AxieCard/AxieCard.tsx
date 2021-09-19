import React from 'react';
import classnames from 'classnames/bind';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { AxieGene } from 'agp-npm/dist/axie-gene';
import Image from 'next/image';
import { Chip } from '@mui/material';

import GeneTable from '../GeneTable';
import { POSTGetAxieDetails } from '../../types';

import styles from './AxieCard.module.scss';

const cx = classnames.bind(styles);

type AxieCardProps = {
    axieDetails: POSTGetAxieDetails;
};

const AxieCard: React.FC<AxieCardProps> = ({ axieDetails }) => {
    const decodeGene = (geneHex: string) => {
        console.log(new AxieGene(geneHex));
        return new AxieGene(geneHex);
    };

    const constructFindSimilarQueries = (
        axieDetails: POSTGetAxieDetails,
        breedCount?: number
    ) => {
        const baseUrl = 'https://axie.zone/finder?search=';

        const classQuery = `class:${axieDetails.class.toLowerCase()};`;
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

        const breedCountQuery = `breed_count:${
            breedCount || axieDetails.breedCount
        };`;
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
            <div className={cx('data-container')}>
                <div>
                    Gene Quality:&nbsp;
                    {decodeGene(axieDetails.genes).getGeneQuality()}%
                </div>
                <div>Breed Count: {axieDetails.breedCount}</div>
            </div>
            <div className={cx('content-container')}>
                <Image
                    src={axieDetails.image}
                    width={320}
                    height={240}
                    alt="image of axie"
                />

                <GeneTable genes={decodeGene(axieDetails.genes)} />
            </div>

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
        </div>
    );
};

export default AxieCard;
