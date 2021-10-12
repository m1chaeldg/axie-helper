import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames/bind';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';

import Layout from '../../components/Layout';
import AxieCard from '../../components/AxieCard';
import PriceTracker from '../../components/PriceTracker';
import { allClasses, maxBreedCount } from '../../common/constants';
import { fetchData } from '../../common/utils';
import { getAxieBriefListQuery } from '../../queries';

import styles from './Breeding.module.scss';
import { POSTGetAxieDetails } from '../../types';

const cx = classnames.bind(styles);

export default function BreedingPage() {
    const [axies, setAxies] = useState<POSTGetAxieDetails[]>([]);
    const [filteredAxies, setFilteredAxies] = useState<POSTGetAxieDetails[]>(
        []
    );
    const d: { [key: string]: any } = {};

    const [cacheAxies, setCacheAxies] = useState(d);
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
            const result = await fetchData(getAxieBriefListQuery, {
                from: 0,
                auctionType: 'All',
                owner: ronin.replace('ronin:', '0x'),
            });

            result.data.axies.results.forEach((axie: any) => list.push(axie));
        }
        return list;
    };

    const fetchAxieDetail = useMemo(
        async () => await fetchAxieDetailFunc(),
        [localStorage.getItem('ronin') || '']
    );

    const fetchRoninDetails = async () => {
        try {
            const list = await fetchAxieDetail;

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
    }, [localStorage.getItem('ronin')]);

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

        console.log('added');
        setBreedPair((prevState) => [...prevState, axie]);
    };

    console.log(breedPair);
    return (
        <Layout>
            <div className={cx('container')}>
                <PriceTracker />
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
                    <div className={cx('card-container')}>
                        {breedPair.map((axie) => (
                            <AxieCard
                                axieDetails={axie}
                                handleSelectToCompare={handleSelectToCompare}
                                breedPair={breedPair}
                                key={axie.id}
                            />
                        ))}
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
