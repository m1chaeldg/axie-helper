import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames/bind';

import Layout from '../../components/Layout';

import { fetchData } from '../../common/utils';
import { getAxieBriefListQuery } from '../../queries';

import styles from './FamailyTree.module.scss';
import { POSTGetAxieDetails } from '../../types';
import { memoize } from '../../common/memoize';
import Chart from 'react-google-charts';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';

const cx = classnames.bind(styles);

export default function FamilyTreePage() {
    // const [axies, setAxies] = useState<{[key:string]: POSTGetAxieDetails}>({});
    const [axies, setAxies] = useState<POSTGetAxieDetails[]>([]);
    const [data, setData] = useState<string[][]>([]);
    const [data2, setData2] = useState<string[][]>([]);
    const [classFilter, setClassFilter] = useState('All');
    const [axieClassOwned, setAxieClassOwned] = useState<string[]>([]);
    // const [filteredAxies, setFilteredAxies] = useState<POSTGetAxieDetails[]>(
    //     []
    // );

    const fetchAxieDetailFunc = async () => {
        const list: POSTGetAxieDetails[] = [];
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

            result.data.axies.results.forEach((axie: POSTGetAxieDetails) =>
                list.push(axie)
            );
        }
        return list;
    };

    const fetchRoninDetails = async () => {
        try {
            const list = await fetchAxieDetailFunc();

            setAxies(list);

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
            setAxieClassOwned(ownedClass);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e: SelectChangeEvent) => {
        const selectedValue = e.target.value;
        setClassFilter(selectedValue);
    };

    useEffect(() => {
        fetchRoninDetails();
    }, []);

    useEffect(() => {
        if (axies) {
            let filtered =
                classFilter === 'All'
                    ? axies
                    : axies?.filter(
                          (axie: any) =>
                              axie.class?.toLowerCase() === classFilter
                      );
            console.log({ classFilter: filtered, axies });

            const cache: { [key: string]: POSTGetAxieDetails } = {};
            axies.forEach((c) => (cache[c.id.toString()] = c));

            const data_ = filtered.map((a) => {
                const parent = cache.hasOwnProperty(a.matronId)
                    ? cache[a.matronId].name + '|' + a.matronId
                    : a.matronId.toString();

                return [a.name + '|' + a.id, parent, ''];
            });

            const data2_ = filtered.map((a) => {
                const parent = cache.hasOwnProperty(a.sireId)
                    ? cache[a.sireId].name + '|' + a.sireId
                    : a.sireId.toString();

                return [a.name + '|' + a.id, parent, ''];
            });

            setData([['Name', 'Parent', 'Tooltip'], ...data_]);
            setData2([['Name', 'Parent', 'Tooltip'], ...data2_]);
        }
    }, [classFilter]);

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
                </div>

                <Chart
                    width={'100%'}
                    height={350}
                    chartType="OrgChart"
                    loader={<div>Loading Chart</div>}
                    data={data}
                    options={{
                        allowHtml: true,
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
                <Chart
                    width={'100%'}
                    height={350}
                    chartType="OrgChart"
                    loader={<div>Loading Chart</div>}
                    data={data2}
                    options={{
                        allowHtml: true,
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
            </div>
        </Layout>
    );
}
