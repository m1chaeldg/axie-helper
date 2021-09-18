import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames/bind';

import styles from './PriceTracker.module.scss';
import axios from 'axios';
import Image from 'next/image';
import ArrowUpwardOutlined from '@mui/icons-material/ArrowUpwardOutlined';
import { ArrowDownwardOutlined } from '@mui/icons-material';
import { Skeleton } from '@mui/material';

const cx = classnames.bind(styles);

type CoinDetails = {
    id: string;
    image: {
        thumb: string;
    };
    market_data: {
        current_price: {
            usd: number;
            myr: number;
            sgd: number;
            php: number;
        };
        price_change_percentage_1h_in_currency: {
            usd: number;
            myr: number;
            sgd: number;
            php: number;
        };
    };
};

export default function PriceTracker() {
    const coins = useMemo(
        () => ['axie-infinity', 'smooth-love-potion', 'ethereum'],
        []
    );

    const [allCoinsDetails, setAllCoinsDetails] = useState<CoinDetails[]>([]);
    const [currency, setCurrency] = useState('usd');
    const [isLoading, setIsLoading] = useState(true);

    const loadCoinGeckoPrice = async (coinArray: string[]) => {
        setIsLoading(true);
        try {
            const promiseArray = coinArray.map(
                async (coin) =>
                    await axios.get(
                        `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&community_data=false`
                    )
            );

            const resolved = await Promise.all(promiseArray);
            const data = resolved.map((result) => result.data);
            console.log('loaded');
            console.log(data);
            setAllCoinsDetails(data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderUpDownArrow = (priceChange: number) => {
        return priceChange > 0 ? (
            <ArrowUpwardOutlined color="success" />
        ) : (
            <ArrowDownwardOutlined
                sx={{
                    color: 'red',
                }}
            />
        );
    };

    useEffect(() => {
        const refresh = setInterval(() => {
            loadCoinGeckoPrice(coins);
        }, 300000);

        return () => clearInterval(refresh);
    }, []);

    useEffect(() => {
        loadCoinGeckoPrice(coins);
    }, []);

    return (
        <div className={cx('container')}>
            {isLoading ? (
                <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                </>
            ) : (
                allCoinsDetails.map((coin: any) => (
                    <div className={cx('coin-detail')} key={coin.id}>
                        <Image
                            src={coin?.image?.thumb}
                            width={25}
                            height={25}
                        />
                        <div>${coin?.market_data.current_price[currency]}</div>
                        <div>
                            {(coin?.market_data.price_change_percentage_1h_in_currency[
                                currency
                            ]).toFixed(2)}
                            %
                            {renderUpDownArrow(
                                coin?.market_data
                                    .price_change_percentage_1h_in_currency[
                                    currency
                                ]
                            )}
                        </div>
                    </div>
                ))
            )}
            <button
                className="btn btn-primary"
                onClick={() => loadCoinGeckoPrice(coins)}
            >
                Refresh
            </button>
        </div>
    );
}
