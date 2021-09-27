import React, { useState } from 'react';
import Layout from '../../components/Layout';
import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';

import styles from './archetypes.module.scss';
import classnames from 'classnames/bind';
import { allClasses } from '../../common/constants';

const cx = classnames.bind(styles);

const cards: {[key: string] : {
        name: string;
        part: string;
        partId: string;
        damage: number;
        shield: number;
    }[]} = {
    plant: [
        {
            name: 'serious',
            part: 'mouth',
            partId: 'mouth-serious',
            damage: 30,
            shield: 20,
        },
        {
            name: 'hot butt',
            partId: 'tail-hot-butt',
            part: 'tail',
            damage: 90,
            shield: 50,
        },
        {
            name: 'pumpkin',
            partId: 'back-pumpkin',
            part: 'back',
            damage: 0,
            shield: 110,
        },
        {
            name: 'cactus',
            partId: 'horn-cactus',
            part: 'horn',
            damage: 110,
            shield: 20,
        },
    ],
    aquatic: [
        {
            name: 'risky fish',
            part: 'mouth',
            partId: 'mouth-risky-fish',
            damage: 110,
            shield: 30,
        },
        {
            name: 'nimo',
            partId: 'tail-nimo',
            part: 'tail',
            damage: 30,
            shield: 0,
        },
        {
            name: 'sponge',
            partId: 'back-sponge',
            part: 'back',
            damage: 60,
            shield: 90,
        },
        {
            name: 'Shoal Star',
            partId: 'horn-shoal-star',
            part: 'horn',
            damage: 115,
            shield: 10,
        },
    ],
    beast: [
        {
            name: 'Nut Cracker',
            part: 'mouth',
            partId: 'mouth-nut cracker',
            damage: 30,
            shield: 20,
        },
        {
            name: 'Nut Cracker',
            partId: 'tail-nut-cracker',
            part: 'tail',
            damage: 90,
            shield: 50,
        },
        {
            name: 'ronin',
            partId: 'back-ronin',
            part: 'back',
            damage: 75,
            shield: 20,
        },
        {
            name: 'imp',
            partId: 'horn-imp',
            part: 'horn',
            damage: 110,
            shield: 20,
        },
    ],
};

export default function ArchetypesPage() {
    const [selectedClass, setSelectedClass] = useState('plant');

    const handleChange = (e: SelectChangeEvent) => {
        const selected = e.target.value;
        setSelectedClass(selected);
    };
    return (
        <Layout>
            <div className={cx('container')}>
                <div className={cx('form')}>
                    <FormControl fullWidth>
                        <TextField size="small" />

                        <Select
                            value={selectedClass}
                            label="Class"
                            size="small"
                            onChange={handleChange}
                        >
                            {cards[selectedClass.toLowerCase()].map(
                                (card, index) => (
                                    <MenuItem value={card.name} key={index}>
                                        {card.name}
                                    </MenuItem>
                                )
                            )}
                        </Select>

                        <Select
                            value={selectedClass}
                            label="Class"
                            size="small"
                            onChange={handleChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            {allClasses.map((axieClass, index) => (
                                <MenuItem value={axieClass} key={index}>
                                    {axieClass
                                        ?.split('')
                                        .map((char, index) =>
                                            index === 0
                                                ? char.toUpperCase()
                                                : char
                                        )
                                        .join('')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <button>Add</button>
                </div>
            </div>
        </Layout>
    );
}
