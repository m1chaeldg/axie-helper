import React from 'react';
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
            {axieDetails.parts.map((p) => {
                return <span>{p.name}</span>;
            })}
        </div>
    );
};
// AXS = [0, 4, 4, 4, 4, 4, 4, 4]
// SLP = [0, 300, 600, 900, 1500, 2400, 3900, 6300]
