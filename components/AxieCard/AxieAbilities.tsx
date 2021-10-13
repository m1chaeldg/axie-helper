import React, { useMemo, useState } from 'react';
import classnames from 'classnames/bind';

import styles from './AxieAbilities.module.scss';
import { POSTGetAxieDetails } from '../../types';
import {
    Fab,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

const cx = classnames.bind(styles);

type AxieAbilitiesProps = {
    axieDetails: POSTGetAxieDetails;
};
export const AxieAbilities: React.FC<AxieAbilitiesProps> = ({
    axieDetails,
}) => {
    let energy = 0,
        atk = 0,
        def = 0;

    axieDetails.parts
        .map((p) => p.abilities)
        .forEach((a) => {
            a.forEach((v) => {
                energy += v.energy;
                atk += v.attack;
                def += v.defense;
            });
        });

    return (
        <div className={cx('card_stats')}>
            <span className={cx('energy', 'stat')}>Engy: {energy}</span>
            &nbsp;
            <span className={cx('atk', 'stat')}>Atk: {atk}</span>
            &nbsp;
            <span className={cx('def', 'stat')}>Def: {def}</span>
        </div>
    );
};

export const AxieParts: React.FC<AxieAbilitiesProps> = ({ axieDetails }) => {
    return (
        <div>
            <h3>Parts</h3>
            <div className={cx('flex-container')}>
                {axieDetails.parts.map((p, i) => {
                    return (
                        <div key={i}>
                            <label className={cx(p.class)}>
                                {p.name} {p.class}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

type BreedingCalcProps = {
    breedPair: POSTGetAxieDetails[];
};
export const BreedingCalc: React.FC<BreedingCalcProps> = ({ breedPair }) => {
    const [slpUsd, setSlpUsd] = useState(0);
    const [axsUsd, setAxsUsd] = useState(0);

    const AXS = [0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0, 0];
    const SLP = [0, 300, 450, 750, 1200, 1950, 3150, 5100, 0, 0];

    useMemo(async () => {
        const r = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=smooth-love-potion,axie-infinity&vs_currencies=usd'
        );
        const j = await r.json();

        setSlpUsd(j['smooth-love-potion'].usd);
        setAxsUsd(j['axie-infinity'].usd);
    }, []);

    const table = (bc1: number, bc2: number) => {
        const cost = {
            parent1: {
                slp: SLP[bc1],
                axs: AXS[bc1],
                usd: Math.round(SLP[bc1] * slpUsd + AXS[bc1] * axsUsd),
            },
            parent2: {
                slp: SLP[bc2],
                axs: AXS[bc2],
                usd: Math.round(SLP[bc2] * slpUsd + AXS[bc2] * axsUsd),
            },
        };
        if (bc1 <= 7 && bc2 <= 7)
            return (
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Parent</TableCell>
                                <TableCell align="right">SLP Cost</TableCell>
                                <TableCell align="right">AXS Cost</TableCell>
                                <TableCell align="right">
                                    Total in USD
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Parent 1
                                </TableCell>
                                <TableCell align="right">
                                    {cost.parent1.slp}
                                </TableCell>
                                <TableCell align="right">
                                    {cost.parent1.axs}
                                </TableCell>
                                <TableCell align="right">
                                    ${cost.parent1.usd}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Parent 2
                                </TableCell>
                                <TableCell align="right">
                                    {cost.parent2.slp}
                                </TableCell>
                                <TableCell align="right">
                                    {cost.parent2.axs}
                                </TableCell>
                                <TableCell align="right">
                                    ${cost.parent2.usd}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Total
                                </TableCell>
                                <TableCell align="right">
                                    {cost.parent1.slp + cost.parent2.slp}
                                </TableCell>
                                <TableCell align="right">
                                    {cost.parent1.axs + cost.parent2.axs}
                                </TableCell>
                                <TableCell align="right">
                                    ${cost.parent1.usd + cost.parent2.usd}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        return null;
    };

    return (
        <div>
            <br />
            <label>1st breed</label>
            {table(breedPair[0].breedCount + 1, breedPair[1].breedCount + 1)}
            <br />
            <label>2nd breed</label>
            {table(breedPair[0].breedCount + 2, breedPair[1].breedCount + 2)}
        </div>
    );
};
