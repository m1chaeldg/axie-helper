import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import styles from './Breeding.module.scss';
import Layout from '../../components/Layout';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import AxieCard from '../../components/AxieCard';
import { fetchData } from '../../common/utils';
import {allClasses, maxBreedCount} from '../../common/constants';
import PriceTracker from "../../components/PriceTracker";

const cx = classnames.bind(styles);

export default function BreedingPage() {
    const [axies, setAxies] = useState();
    const [filteredAxies, setFilteredAxies] = useState();
    const [classFilter, setClassFilter] = useState('All');
    const [breedCountFilter, setBreedCountFilter] = useState(7);

    const fetchRoninDetails = async () => {
        try {
            const data = await fetchData(
                `query GetAxieBriefList($auctionType: AuctionType, $from: Int, $sort: SortBy, $size: Int, $owner: String) {
                axies(auctionType: $auctionType, from: $from, sort: $sort, size: $size, owner: $owner) {
                total
                results {
                    ...AxieBrief
                    __typename
                }
                __typename
                }
            }
                                  
            fragment AxieBrief on Axie {
                id  
                name
                stage
                class
                genes
                breedCount
                image
                title
                battleInfo {
                    banned
                    __typename
                }
                auction {
                    currentPrice
                    currentPriceUSD
                    __typename
                }
                parts {
                    id
                    name
                    class
                    type
                    specialGenes
                    __typename 
                }
                __typename
            }
            `,
                {
                    axieId: '447258',
                    from: 0,
                    auctionType: 'All',
                    owner: '0xbcb5f39deac3670f8a8275941ea52b3ef6b6bb3a',
                }
            );
            console.log(data);
            setAxies(data.data.axies.results);
            setFilteredAxies(data.data.axies.results);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        const selectedValue = e.target.value;
        setClassFilter(selectedValue);
    };

    const handleChangeBreedCount = (e) => {
        const selectedValue = e.target.value;
        setBreedCountFilter(selectedValue);
    };

    useEffect(() => {
        if (axies) {
            handleFilter();
        }
    }, [breedCountFilter, classFilter]);

    const handleFilter = () => {
        let filtered =
            classFilter === 'All'
                ? axies
                : axies?.filter(
                      (axie: any) => axie.class.toLowerCase() === classFilter
                  );

        filtered = filtered.filter(
            (axie) => axie.breedCount <= breedCountFilter
        );

        setFilteredAxies(filtered);
    };

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
                            {allClasses.map((axieClass) => (
                                <MenuItem value={axieClass}>
                                    {axieClass
                                        .split('')
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
                            value={breedCountFilter}
                            label="Breed Count"
                            size="small"
                            onChange={handleChangeBreedCount}
                        >
                            {
                                new Array(maxBreedCount).fill(0).map((num, index) => (
                                    <MenuItem value={index} key={index}>{index}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>
                <button onClick={() => fetchRoninDetails()}>Fetch</button>

                <PriceTracker />
                <div className={cx('axies-container')}>
                    {filteredAxies?.map((axie) => (
                        <AxieCard axieDetails={axie} />
                    ))}
                </div>
            </div>
        </Layout>
    );
}
