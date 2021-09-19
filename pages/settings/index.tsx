import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { TextField } from '@mui/material';

import Layout from '../../components/Layout';
import styles from './settings.module.scss';

const cx = classnames.bind(styles);

export default function SettingsPage() {
    const [isEdit, setIsEdit] = useState(false);
    const [roninAddress, setRoninAddress] = useState('');

    useEffect(() => {
        const localSavedRonin = localStorage.getItem('ronin');
        if (localSavedRonin) {
            setRoninAddress(localSavedRonin);
        }
    }, []);

    const handleSaveRoninAddress = () => {
        localStorage.setItem('ronin', roninAddress);
        setIsEdit(false);
    };

    return (
        <Layout>
            <div className={cx('container')}>
                <div className={cx('content-container')}>
                    <div className={cx('ronin-address-input')}>
                        <TextField
                            label="Ronin Address"
                            variant="outlined"
                            onChange={(e) => setRoninAddress(e.target.value)}
                            className={cx('input')}
                            value={roninAddress}
                            size="small"
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
                </div>
            </div>
        </Layout>
    );
}
