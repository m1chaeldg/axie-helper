import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import styles from './BinancePriceTracker.module.scss';
import axios from 'axios';
import Image from 'next/image';
import { Skeleton } from '@mui/material';

const cx = classnames.bind(styles);

export default function BinancePriceTracker() {
    const binanceCoins = {
        AXSUSDT: 'AXS-USDT',
        SLPUSDT: 'SLP-USDT',
        XRPUSDT: 'XRP-USDT',
    };
    const coinPhCoins = {
        'XRP-PHP': 'XRP-PHP',
    };

    const computeCoins = {
        SLPPHP: 'SLP-PHP',
        AXSSLP: 'AXS-SLP',
        USDTPHP: 'USDT-PHP',
    };

    const [allBinanceCoinsDetails, setAllBinanceCoinsDetails] = useState<any[]>(
        []
    );
    const [allCoinPhDetails, setAllCoinPhDetails] = useState<any[]>([]);
    const [allOtherCoinDetails, setAllOtherCoinDetails] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const loadCoinPhPrice = async (coins: any) => {
        // return json.markets.find((c: any) => c.symbol === 'XRP-PHP').bid;

        setIsLoading(true);
        try {
            const list = [];
            const coinPhData = await axios.get(`/api/coinPh`);

            for (const symbol_ in coins) {
                if (Object.prototype.hasOwnProperty.call(coins, symbol_)) {
                    const label = coins[symbol_];
                    const price = coinPhData.data.markets.find(
                        (c: any) => c.symbol === symbol_
                    ).bid;

                    list.push({
                        api: 'coinPh',
                        symbol: symbol_,
                        label: label,
                        price: price,
                    });
                }
            }
            setAllCoinPhDetails(list);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const loadBinancePrice = async (coins: any) => {
        setIsLoading(true);
        try {
            const list = [];
            for (const symbol_ in coins) {
                if (Object.prototype.hasOwnProperty.call(coins, symbol_)) {
                    const label = coins[symbol_];
                    const json = await axios.get(
                        `https://api.binance.com/api/v3/avgPrice?symbol=${symbol_}`
                    );

                    list.push({
                        api: 'binance',
                        symbol: symbol_,
                        label: label,
                        price: json.data.price,
                    });
                }
            }
            setAllBinanceCoinsDetails(list);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (allBinanceCoinsDetails.length > 0 && allCoinPhDetails.length > 0) {
            const slp_usdt = allBinanceCoinsDetails.find(
                (c) => c.symbol == 'SLPUSDT'
            ).price;
            const xrp_php = allCoinPhDetails.find(
                (c) => c.symbol == coinPhCoins['XRP-PHP']
            ).price;
            const xrp_usdt = allBinanceCoinsDetails.find(
                (c) => c.symbol == 'XRPUSDT'
            ).price;
            const axs_usdt = allBinanceCoinsDetails.find(
                (c) => c.symbol == 'AXSUSDT'
            ).price;

            const list = [];
            let slp_to_php = (slp_usdt * xrp_php) / xrp_usdt;
            let axs_to_Slp = axs_usdt / slp_usdt;
            let usdt_to_php = xrp_php / xrp_usdt;

            list.push({
                api: 'compute',
                symbol: computeCoins.SLPPHP,
                label: computeCoins.SLPPHP,
                price: slp_to_php.toFixed(2),
            });

            list.push({
                api: 'compute',
                symbol: computeCoins.AXSSLP,
                label: computeCoins.AXSSLP,
                price: axs_to_Slp.toFixed(2),
            });
            list.push({
                api: 'compute',
                symbol: computeCoins.USDTPHP,
                label: computeCoins.USDTPHP,
                price: usdt_to_php.toFixed(2),
            });

            setAllOtherCoinDetails(list);
        }
    }, [allBinanceCoinsDetails, allCoinPhDetails]);

    const loadAllCoins = () => {
        loadBinancePrice(binanceCoins);
        loadCoinPhPrice(coinPhCoins);
    };
    useEffect(() => {
        const refresh = setInterval(() => {
            loadAllCoins();
        }, 30 * 1000);

        return () => clearInterval(refresh);
    }, []);

    useEffect(() => {
        loadAllCoins();
    }, []);

    let renderCoin = (list: any[], type: string) => {
        return list
            .filter((c) => c.api == type)
            .map((coin: any) => (
                <div className={cx('coin-detail')} key={coin.symbol}>
                    <div>{coin.label}</div>
                    <div>{coin.price}</div>
                </div>
            ));
    };
    return (
        <div className={cx('container')}>
            {isLoading ? (
                <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                </>
            ) : (
                [
                    renderCoin(allBinanceCoinsDetails, 'binance'),
                    renderCoin(allCoinPhDetails, 'coinPh'),
                    renderCoin(allOtherCoinDetails, 'compute'),
                ]
            )}
            <button className="btn btn-primary" onClick={() => loadAllCoins()}>
                Refresh
            </button>
        </div>
    );
}
