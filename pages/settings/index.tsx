import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import {FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';

import classnames from 'classnames/bind';
import styles from './settings.module.scss';
import { fetchData } from '../../common/utils';
import AxieCard from '../../components/AxieCard';

const cx = classnames.bind(styles);

export default function SettingsPage() {
    const [roninAddress, setRoninAddress] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [axies, setAxies] = useState();
    const [filter, setFilter] = useState('All')

    const handleSaveRoninAddress = () => {
        localStorage.setItem('ronin', roninAddress);
        setIsEdit(false);
    };

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
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFilter(e.target.value)
    }
    useEffect(() => {
        const localSavedRonin = localStorage.getItem('ronin');
        if (localSavedRonin) {
            setRoninAddress(localSavedRonin);
        }
    }, []);

    console.log(filter)
    return (
        <div>
            <Header />
            <div className={cx('container')}>
                <div className={cx('ronin-address-input')}>
                    <TextField
                        label="Ronin Address"
                        variant="outlined"
                        onChange={(e) => setRoninAddress(e.target.value)}
                        className={cx('input')}
                        value={roninAddress}
                        disabled={!isEdit}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={
                            isEdit
                                ? handleSaveRoninAddress
                                : () => setIsEdit(true)
                        }
                    >
                        {isEdit ? 'Save' : 'Edit'}
                    </button>
                </div>

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Class</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filter}
                        label="Class"
                        onChange={handleChange}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="plant">Plant</MenuItem>
                        <MenuItem value="aquatic">Aquatic</MenuItem>
                        <MenuItem value="bird">Bird</MenuItem>
                        <MenuItem value="reptile">Bird</MenuItem>
                        <MenuItem value="bug">Bird</MenuItem>
                        <MenuItem value="beast">Beast</MenuItem>
                        <MenuItem value="dusk">Dusk</MenuItem>
                        <MenuItem value="dawn">Dawn</MenuItem>
                        <MenuItem value="mech">Mech</MenuItem>
                    </Select>
                </FormControl>

                <div className={cx('axies-container')}>
                    {axies?.map((axie) => (
                        <div>
                            <h3>{axie.name}</h3>
                            <AxieCard axieDetails={axie} />
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={() => fetchRoninDetails()}>Fetch</button>


        </div>
    );
}
