import React from 'react';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './style.module.css';
import useFitText from 'use-fit-text';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface StatBlockProps {
    copyOnClick?: string;
    children: React.ReactNode;
}

export default ({ copyOnClick, children}: StatBlockProps) => {
    

    return (
        <CopyOnClick text={copyOnClick}>
            <div>
            {children}
            </div>

        </CopyOnClick>
    );
};
