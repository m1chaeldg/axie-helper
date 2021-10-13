import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames/bind';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

import Layout from '../../components/Layout';
import AxieCard from '../../components/AxieCard';
import { BreedingCalc } from '../../components/AxieCard/AxieAbilities';

import PriceTracker from '../../components/PriceTracker';
import { allClasses, maxBreedCount } from '../../common/constants';
import { fetchData } from '../../common/utils';
import { getAxieBriefListQuery } from '../../queries';

import styles from './Breeding.module.scss';
import { POSTGetAxieDetails } from '../../types';
import handler from '../api/hello';

const cx = classnames.bind(styles);

const cache: { [key: string]: any } = {};

const memoize = async (handler: () => Promise<any>, arg: string) => {
    if (cache.hasOwnProperty(arg)) {
        return cache[arg];
    }
    const value = await handler();
    cache[arg] = value;
    return value;
};

export default function BreedingPage() {
    const [axies, setAxies] = useState<POSTGetAxieDetails[]>([]);
    const [filteredAxies, setFilteredAxies] = useState<POSTGetAxieDetails[]>(
        []
    );

    const [classFilter, setClassFilter] = useState('All');
    const [breedCountFilter, setBreedCountFilter] = useState(7);
    const [axieClassOwned, setAxieClassOwned] = useState<string[]>([]);
    const [breedPair, setBreedPair] = useState<POSTGetAxieDetails[]>([]);

    const fetchAxieDetailFunc = async () => {
        const list: any[] = [];
        const localSavedRonin = localStorage.getItem('ronin') || '';
        const arr = localSavedRonin.split('\n');

        for (let i = 0; i < arr.length; i++) {
            const ronin = arr[i];
            const result = await memoize(
                () =>
                    fetchData(getAxieBriefListQuery, {
                        from: 0,
                        auctionType: 'All',
                        owner: ronin.replace('ronin:', '0x'),
                    }),
                ronin
            );

            result.data.axies.results.forEach((axie: any) => list.push(axie));
        }
        return list;
    };

    const fetchRoninDetails = async () => {
        try {
            const list = await fetchAxieDetailFunc();

            setAxies(list);
            setFilteredAxies(list);

            const ownedClass = Array.from(
                new Set(
                    list.map((axie: any) => {
                        if (!axie.class) {
                            return 'Egg';
                        }

                        return axie.class?.toLowerCase();
                    })
                )
            ) as string[];
            console.log(list);
            setAxieClassOwned(ownedClass);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e: SelectChangeEvent) => {
        const selectedValue = e.target.value;
        setClassFilter(selectedValue);
    };

    const handleChangeBreedCount = (e: SelectChangeEvent) => {
        const selectedValue = parseInt(e.target.value, 10);
        setBreedCountFilter(selectedValue);
    };

    useEffect(() => {
        if (axies) {
            handleFilter();
        }
    }, [breedCountFilter, classFilter]);

    useEffect(() => {
        fetchRoninDetails();
    }, []);

    const handleFilter = () => {
        let filtered =
            classFilter === 'All'
                ? axies
                : axies?.filter(
                      (axie: any) => axie.class?.toLowerCase() === classFilter
                  );

        filtered = filtered.filter(
            (axie) => axie.breedCount <= breedCountFilter
        );

        setFilteredAxies(filtered);
    };

    const handleSelectToCompare = (axie: POSTGetAxieDetails) => {
        const foundIndex = breedPair.findIndex(
            (selected) => selected.id === axie.id
        );

        if (foundIndex > -1) {
            setBreedPair((prevState) =>
                prevState.filter((selected) => selected.id !== axie.id)
            );

            return;
        }

        if (breedPair.length === 2) {
            console.log('can only select 2');
            return;
        }

        setBreedPair((prevState) => [...prevState, axie]);
    };

    const breadingUrl = useMemo(() => {
        if (breedPair.length == 2)
            return (
                'https://freakitties.github.io/axie/calc.html?sireId=' +
                breedPair[0].id +
                '&matronId=' +
                breedPair[1].id +
                '&showDetails=true'
            );
        return '';
    }, [breedPair]);

    console.log(breedPair);
    return (
        <Layout>
            <div className={cx('container')}>
                <div className={cx('filter-container')}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Class
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={classFilter}
                            label="Class"
                            size="small"
                            onChange={handleChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            {axieClassOwned.map((axieClass, index) => (
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

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Breed Count
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={breedCountFilter.toString()}
                            label="Breed Count"
                            size="small"
                            onChange={handleChangeBreedCount}
                        >
                            {new Array(maxBreedCount)
                                .fill(0)
                                .map((num, index) => (
                                    <MenuItem value={index} key={index}>
                                        {index}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>

                <div className={cx('comparison-container')}>
                    <h3>Breeding Pair</h3>
                    <div className={cx('axies-container')}>
                        {breedPair.map((axie) => (
                            <AxieCard
                                axieDetails={axie}
                                handleSelectToCompare={handleSelectToCompare}
                                breedPair={breedPair}
                                key={axie.id}
                            />
                        ))}
                        {breedPair.length == 2 && (
                            <div>
                                <a
                                    href={breadingUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    Open Breeding Calc
                                    <OpenInNewOutlinedIcon />
                                </a>
                                <BreedingCalc breedPair={breedPair} />
                            </div>
                        )}
                    </div>
                </div>

                <div className={cx('axies-container')}>
                    {filteredAxies?.map((axie, index) => (
                        <AxieCard
                            axieDetails={axie}
                            handleSelectToCompare={handleSelectToCompare}
                            breedPair={breedPair}
                            key={axie.id}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
}
