import React, { memo,useState, useEffect } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import PowerButtons from '@/components/server/console/PowerButtons';
import MainServerButton from '@/components/server/MainServerButton';
import { Alert } from '@/components/elements/alert';
import styled1 from 'styled-components/macro';
export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import StatBlock from '@/components/server/console/StatBlock';
import { Server } from '@/api/server/getServer';

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState(state => state.server.data!.name);
    const description = ServerContext.useStoreState(state => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState(state => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState(state => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState(state => state.server.data!.isNodeUnderMaintenance);
    
    const ConsoleServer = styled1.div`
    
    margin-left: 0 !important;
    -webkit-transition: all .3s;
    transition: all .3s;
    -webkit-transition: all .3s;
    transition: all .3s;
    @media screen and (min-width: 64em) {
        margin-left: 280px;
    }
    .maindiv {
        display: flex;
        flex-direction: column-reverse;
    }
    .servername {
        margin-bottom: 0.625rem;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        color: var(--ptx-text);
        user-select: none;
        font-weight: 700;
        font-size: 2.25rem;
        line-height: 2.5rem;
        margin-right: 1rem;
        @media (min-width: 768px) {
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
        }
    }

    .servernamediv {
        width: 100%;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: flex-start;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        align-items: flex-start;
    }
    .serverconsolemain {
        
        gap: 1.75rem;
    }
    .consolediv {
        grid-column: span 7 / span 7;
        width: 100%;
    }

    .consolestats {
        display: grid;
        flex-wrap: wrap;
        margin-bottom: 1rem;
        margin-top: 1rem;
        grid-template-columns: 1fr;

        @media (min-width: 490px) {
            grid-template-columns: 1fr 1fr;
            padding-left: 0rem;
        }
        @media (min-width: 1020px) {
            grid-template-columns: 1fr 1fr 1fr;
            padding-left: 0rem;
        }
        @media (min-width: 1560px) {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
            padding-left: 0rem;
        }
    }

    .serverboxdiv {
        margin-top: 1rem;
        margin-bottom: 1rem;
        max-width: 100%;

        @media (min-width: 490px) {
            
            padding-left: 1rem;
            padding-right: 1rem;
        }
        @media (min-width: 1020px) {
            
            padding-left: 1rem;
            padding-right: 1rem;
        }
        @media (min-width: 1560px) {
            padding-left: 1rem;
            padding-right: 1rem;
        }
    }
    .serverboxdiv1 {
        margin-top: 1rem;
        margin-bottom: 1rem;
        max-width: 100%;
        @media (min-width: 1560px) {
            padding-left: 1rem;
            padding-right: 1rem;
        }

        @media (min-width: 490px) {
            
            padding-left: 1rem;
            padding-right: 1rem;
        }
        @media (min-width: 1020px) {
            
            padding-left: 1rem;
            padding-right: 1rem;
        }
    }
    .serverbox {
        background-color: var(--ptx-secondary);
        overflow-wrap: break-word;
        height: 76px;
        border-bottom-left-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        max-width: 100%;
    }
    .serverboxhead {
        --tw-bg-opacity: 1;
        background-color: rgba(31.008,40.8,50.592,var(--tw-bg-opacity));
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        padding: 0.5rem;
        border-bottom-width: 2px;
        --tw-border-opacity: 1;
        border-color: rgba(16,16,16,var(--tw-border-opacity));
        background: hsl(216deg 100% 58%);
        max-width: 100%;
        height: 40px;
    }
    .serverboxfoot {
        padding: 0.5rem;
        max-width: 100%;
        height: 36px;
        border-bottom-width: 2px;
        border-color: rgba(141,143,172,0.1);
        background-color: var(--ptx-secondary);
        border-bottom-left-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;

        font-size: 0.875rem;
        line-height: 1.25rem;
        cursor: pointer;
    }

    .serverboxspan {
        font-size: 1rem;
        line-height: 1.25rem;
        text-transform: uppercase;
        --tw-text-opacity: 1;
        display: flex;
        color: white;
        gap: 0.5rem;
    }

    .serverboxicon {
        margin-right: 0.5rem

    }
    
`;

    return (
        <ServerContentBlock title={'Console'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}
            <ConsoleServer>
                <MainServerButton/>
                <div className="serverconsolemain">
                    <div className="w-full col-span-7 consolediv">
                                <ServerDetailsBlock/>
                        <Spinner.Suspense>
                            <Console />
                        </Spinner.Suspense>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                <StatGraphs />
                </div>
            </ConsoleServer>
            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
