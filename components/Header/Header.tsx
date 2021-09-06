import React from 'react';
import classnames from 'classnames/bind';
import Link from 'next/link';

import styles from './Header.module.scss';

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
                <Link href="/scholarship">Apply Scholarship</Link>
            </div>
        </div>
    );
};

export default Header;
