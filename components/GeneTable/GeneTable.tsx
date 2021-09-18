import React from 'react';
import { AxieGene } from 'agp-npm/dist/axie-gene';
import classnames from 'classnames/bind';

import { deriveClassColor } from '../../common/classColor';
import { axieParts } from '../../common/constants';
import styles from './GeneTable.module.scss';

const cx = classnames.bind(styles);

type GeneTableProps = {
    genes: MyAxieGene;
};

interface MyAxieGene extends AxieGene {
    [key: string]: any;
}
export default function GeneTable({ genes }: GeneTableProps) {
    return (
        <div className={cx('container')}>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th>D</th>
                        <th>R1</th>
                        <th>R2</th>
                    </tr>
                </thead>

                <tbody>
                    {axieParts.map((part, index) => (
                        <tr key={index}>
                            <td
                                style={{
                                    color: deriveClassColor(genes[part].d.cls),
                                }}
                            >
                                {genes[part].d.name}
                            </td>
                            <td
                                style={{
                                    color: deriveClassColor(genes[part].r1.cls),
                                }}
                            >
                                {genes[part].r1.name}
                            </td>
                            <td
                                style={{
                                    color: deriveClassColor(genes[part].r2.cls),
                                }}
                            >
                                {genes[part].r2.name}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
