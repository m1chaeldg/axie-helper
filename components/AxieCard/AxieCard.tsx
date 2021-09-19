import React from 'react';
import classnames from 'classnames/bind';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Link } from 'next/link';
import styles from './AxieCard.module.scss';
import Image from 'next/image';
import GeneTable from '../GeneTable';
import { AxieGene } from 'agp-npm/dist/axie-gene';
import { POSTGetAxieDetails } from 'types';
import { Chip } from '@mui/material';

const cx = classnames.bind(styles);

type AxieCardProps = {
    axieDetails: POSTGetAxieDetails;
};
export default function AxieCard({ axieDetails }: AxieCardProps) {
    const decodeGene = (geneHex: string) => {
        console.log(new AxieGene(geneHex));
        return new AxieGene(geneHex);
    };

    console.log(axieDetails);

    const constructFindSimilarQueries = (
        axieDetails: POSTGetAxieDetails,
        breedCount?: number
    ) => {
        const query = new URLSearchParams();

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
            console.log(part.class.toLowerCase());
            console.log(axieDetails.class.toLowerCase());
            if (part.class.toLowerCase() === axieDetails.class.toLowerCase()) {
                return acc + 1;
            }

            return acc
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
            <div className={cx('content-container')}>
                <Image src={axieDetails.image} width={320} height={240} />

                <GeneTable genes={decodeGene(axieDetails.genes)} />
            </div>
            <div>
                Gene Quality:
                {decodeGene(axieDetails.genes).getGeneQuality()}%
            </div>
            <div>Breed Count: {axieDetails.breedCount}</div>
            <div>
                <a
                    href={constructFindSimilarQueries(axieDetails)}
                    target="_blank"
                    rel="noreferral noopener"
                >
                    Look for exact same parts
                </a>

                <a
                    href={constructFindSimilarQueries(axieDetails, 0)}
                    target="_blank"
                    rel="noreferral noopener"
                >
                    Look for 0 breed count
                </a>
            </div>
        </div>
    );
}
