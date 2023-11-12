import React from 'react';
import styled from 'styled-components/macro';

const ChartBox = styled.div`
    
    margin-top:1.25rem;
    background-color:var(--wp-secondary);
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    border-width: 2px 2px 2px 2px;
    border-color: var(--ptx-border);
    overflow:hidden;


    .namediv {
        --tw-bg-opacity: 1;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        padding: 0.5rem;
        border-bottom-width: 2px;
        --tw-border-opacity: 1;
        border-color: rgba(16,16,16,var(--tw-border-opacity));
        background: var(--ptx-button);
        max-width: 100%;
        height: 40px;
    }
    .namespan {
        font-size: 1rem;
        line-height: 1.25rem;
        text-transform: uppercase;
        --tw-text-opacity: 1;
        display: flex;
        color: white;
        gap: 0.5rem;
    }
    .namehead1 {
        display:inline;
        font-size:1.5em;
        font-weight:bold;
        color: var(--wp-textcolor);
    }
    .usagediv {
        padding: 20px 20px 20px;
        
    }
    .usagespan {
        font-size: 1em;
        color: var(--wp-textcolor);
    }


`;

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
}

export default ({ title, legend, children }: ChartBlockProps) => (
    <ChartBox>
        <div>
        <div>
            <div className="namediv relative flex">
            <span className="namespan"><b>{title}</b></span>
            </div>
        </div>
        {legend && <p className={'text-sm flex items-center'}>{legend}</p>}
        {children}
        </div>
    </ChartBox>
);
