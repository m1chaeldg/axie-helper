import React from 'react';
import Header from '../Header';

import styles from './Layout.module.scss';
import classnames from 'classnames/bind';
const cx = classnames.bind(styles);

type LayoutProps = {
    children: React.ReactNode;
};
export default function Layout({ children }: LayoutProps) {
    return (
        <div className={cx('container')}>
            <Header />

            {children}
        </div>
    );
}
