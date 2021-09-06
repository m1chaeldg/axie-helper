import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import styles from './EnergyCounter.module.scss';

const cx = classnames.bind(styles);

const EnergyCounter: React.FC = () => {
    const [count, setCount] = useState(3);

    const addOneCount = () => {
        if (count === 10) {
            return;
        }
        setCount((prevState) => prevState + 1);
    };

    const addTwoCount = () => {
        if (count > 8) {
            return;
        }
        setCount((prevState) => prevState + 2);
    };

    const minusOneCount = () => {
        if (count === 0) {
            return;
        }
        setCount((prevState) => prevState - 1);
    };

    const setZero = () => {
        setCount(0);
    };
    const reset = () => {
        setCount(3);
    };

    useEffect(() => {
        const keydownListener = (e: KeyboardEvent) => {
            switch (true) {
                case e.key === 'ArrowLeft' || e.key === 'a':
                    minusOneCount();
                    break;
                case e.key === 'ArrowRight' || e.key === 'd':
                    addOneCount();
                    break;
                case e.key === 'ArrowUp' || e.key === 'w':
                    addTwoCount();
                    break;
                case e.key === 'ArrowDown' || e.key === 'x':
                    setZero();
                    break;
                case e.key === ' ':
                    reset();
                    break;
            }
        };
        window.addEventListener('keydown', keydownListener);

        return () => window.removeEventListener('keydown', keydownListener);
    }, [count]);

    return (
        <div className={cx('container')}>
            <div className={cx('counter-container')}>
                <div className={cx('count')}>{count}</div>

                <div className={cx('buttons-container')}>
                    <div>
                        <button
                            className={cx('btn', 'btn-danger')}
                            onClick={reset}
                        >
                            Reset
                        </button>
                    </div>
                    <div className={cx('next-round-container')}>
                        <button
                            className={cx('btn', 'btn-primary')}
                            onClick={addTwoCount}
                        >
                            Next Round
                        </button>
                    </div>

                    <div className={cx('control-container')}>
                        <button
                            className={cx('btn', 'btn-primary')}
                            onClick={minusOneCount}
                        >
                            {'<'}
                        </button>
                        <button
                            className={cx('btn', 'btn-secondary')}
                            onClick={setZero}
                        >
                            0
                        </button>
                        <button
                            className={cx('btn', 'btn-primary')}
                            onClick={addOneCount}
                        >
                            {'>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyCounter;
