import React from 'react';
import classnames from 'classnames/bind';
import Link from 'next/link';

import styles from './Header.module.scss';
import { ENABLE_PLAYGROUND, ENABLE_SCHOLARSHIP_PAGE } from '../../flags';

const cx = classnames.bind(styles);

const Header: React.FC = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('logo-container')}>
                <Link href="/">Axie Toolbox</Link>
            </div>

            <div>
                {/*<Link href="/">Home</Link>*/}
                <Link href="/energy">Energy Counter</Link>
                {ENABLE_SCHOLARSHIP_PAGE && (
                    <Link href="/scholarship">Apply Scholarship</Link>
                )}
                {ENABLE_PLAYGROUND && (
                    <Link href="/playground">Playground</Link>
                )}

                <Link href="/breeding">Breeding</Link>
                <Link href="/settings">Settings</Link>
            </div>
        </div>
    );
};

export default Header;
