import React, { useEffect, useState } from 'react';
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
    const [classFilter, setClassFilter] = useState('All');
    const [breedCountFilter, setBreedCountFilter] = useState(7);
    const [axieClassOwned, setAxieClassOwned] = useState<string[]>([]);
    const [breedPair, setBreedPair] = useState<POSTGetAxieDetails[]>([]);

    const fetchRoninDetails = async () => {
        try {
            const data = await fetchData(getAxieBriefListQuery, {
                from: 0,
                auctionType: 'All',
                owner: '0xbcb5f39deac3670f8a8275941ea52b3ef6b6bb3a',
            });

            setAxies(data.data.axies.results);
            setFilteredAxies(data.data.axies.results);

            const ownedClass = Array.from(
                new Set(
                    data.data.axies.results.map((axie: any) => {
                        if (!axie.class) {
                            return 'Egg';
                        }

                        return axie.class?.toLowerCase();
                    })
                )
            ) as string[];
            console.log(data.data.axies.results);
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
