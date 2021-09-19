import React from 'react';
import classnames from 'classnames/bind';

import styles from './AxieCard.module.scss';
import Image from 'next/image';
import GeneTable from '../GeneTable';
import {AxieGene} from "agp-npm/dist/axie-gene";
import { POSTGetAxieDetails } from "types";

const cx = classnames.bind(styles);

type AxieCardProps = {
    axieDetails: POSTGetAxieDetails
}
export default function AxieCard({ axieDetails } : AxieCardProps) {
    const decodeGene = (geneHex: string) => {
        console.log(new AxieGene(geneHex));
        return new AxieGene(geneHex);
    };

    return (
        <>
            <div className={cx('container')}>
                <Image
                    src={axieDetails.image}
                    width={320}
                    height={240}
                />

                <GeneTable genes={decodeGene(axieDetails.genes)} />
            </div>
            <div>
                Gene Quality:
                {decodeGene(axieDetails.genes).getGeneQuality()}%
            </div>
            <div>
                Breed Count: {axieDetails.breedCount}
            </div>
        </>
    );
}
