import React from 'react';
import classnames from 'classnames/bind';

import styles from './AxieStats.module.scss';
import { POSTGetAxieDetails } from '../../types';
import { Chip, Button, LinearProgress, Stack } from '@mui/material';

const cx = classnames.bind(styles);

type AxieStatsProps = {
    axieDetails: POSTGetAxieDetails;
};
export const AxieStats: React.FC<AxieStatsProps> = ({ axieDetails }) => {
    return (
        <div className={cx('container')}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <div>
                    Health: {axieDetails.stats.hp}
                    <LinearProgress
                        variant="determinate"
                        value={(axieDetails.stats.hp * 100) / 61}
                    />
                </div>

                <div>
                    <label>Speed: {axieDetails.stats.speed}</label>
                    <LinearProgress
                        variant="determinate"
                        value={(axieDetails.stats.speed * 100) / 61}
                    />
                </div>
                <div>
                    Skill: {axieDetails.stats.skill}
                    <LinearProgress
                        variant="determinate"
                        value={(axieDetails.stats.skill * 100) / 61}
                    />
                </div>
                <div>
                    Morale: {axieDetails.stats.morale}
                    <LinearProgress
                        variant="determinate"
                        value={(axieDetails.stats.morale * 100) / 61}
                    />
                </div>
            </Stack>
        </div>
    );
};
