import React, { useMemo, useState } from 'react';
import classnames from 'classnames/bind';

import styles from './AxieAbilities.module.scss';
import { POSTGetAxieDetails } from '../../types';

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
        <div className={cx('card_stats')}>
            {axieDetails.parts.map((p, i) => {
                return <span key={'p' + i}>{p.name} </span>;
            })}
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
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>Parent</th>
                            <th>SLP Cost</th>
                            <th>AXS Cost</th>
                            <th>Total in USD</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Parent 1</td>
                            <td>{cost.parent1.slp}</td>
                            <td>{cost.parent1.axs}</td>
                            <td>${cost.parent1.usd}</td>
                        </tr>
                        <tr>
                            <td>Parent 2</td>
                            <td>{cost.parent2.slp}</td>
                            <td>{cost.parent2.axs}</td>
                            <td>${cost.parent2.usd}</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{cost.parent1.slp + cost.parent2.slp}</td>
                            <td>{cost.parent1.axs + cost.parent2.axs}</td>
                            <td>${cost.parent1.usd + cost.parent2.usd}</td>
                        </tr>
                    </tbody>
                </table>
            );
        return null;
    };

    return (
        <div>
            <label>1st breed</label>
            {table(breedPair[0].breedCount + 1, breedPair[1].breedCount + 1)}
            <label>2nd breed</label>
            {table(breedPair[0].breedCount + 2, breedPair[1].breedCount + 2)}
        </div>
    );
};
