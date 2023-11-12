import React, { useEffect, useMemo, useState } from 'react';

import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import { ServerContext } from '@/state/server';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import UptimeDuration from '@/components/server/UptimeDuration';
import StatBlock from '@/components/server/console/StatBlock';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import classNames from 'classnames';
import { capitalize } from '@/lib/strings';
import styled1 from 'styled-components/macro';
import { Server } from '@/api/server/getServer';
import { useStoreState, State } from 'easy-peasy';
import { ApplicationStore } from '@/state';


type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime' | 'rx' | 'tx', number>;





const Limit = ({ limit, children }: { limit: string | null; children: React.ReactNode }) => (
    <>
        {children}
        <span className={'ml-1 text-gray-300 text-[70%] select-none'}>/ {limit || <>&infin;</>}</span>
    </>
);

const ServerDetailsBlock = ({ className }: { className?: string }) => {

    const pteroxSettingsJSON = useStoreState((state: ApplicationStore) => state.settings.data!.pterox_settings);
    const pteroxSettings: { [name: string]: any } = {};
    try {
        const settings: any[] = JSON.parse(pteroxSettingsJSON);
    
        for (const element of settings) {
            pteroxSettings[element.name] = element;
        }
    } catch (error) {
        console.error('Error parsing pteroxSettingsJSON:', error);
    }


    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0, tx: 0, rx: 0 });

    const status = ServerContext.useStoreState((state) => state.status.value);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const textLimits = useMemo(
        () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : null,
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : null,
            disk: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : null,
        }),
        [limits]
    );

    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((allocation) => allocation.isDefault);

        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    useEffect(() => {
        if (!connected || !instance) {
            return;
        }

        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
            tx: stats.network.tx_bytes,
            rx: stats.network.rx_bytes,
            uptime: stats.uptime || 0,
        });
    });

    
    
const ConsoleServerDetails = styled1.div`
    
    
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
        background-color: var(--ptx-button);
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        padding: 0.5rem;
        border-bottom-width: 2px;
        --tw-border-opacity: 1;
        border-color: rgba(16,16,16,var(--tw-border-opacity));
        background: var(--ptx-button);
        max-width: 100%;
        height: 40px;
        text-overflow: ellipsis;
        white-space: nowrap;
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

        font-size: 1rem;
        line-height: 1.25rem;
        cursor: pointer;
        color: var(--ptx-text);
        text-overflow: ellipsis;
        white-space: nowrap;
        
    }
    .serverboxfootspan {

        font-size: 0.8rem;
        line-height: 1.25rem;
        cursor: pointer;
        color: var(--ptx-text);
        text-overflow: ellipsis;
        white-space: nowrap;
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
        margin-right: 0.5rem;
    }
    

    .ips {
        display: none;
        :hover {
            display: flex;
        }
    }
`;


    return (
        <ConsoleServerDetails>
        <div className="consolestats">
                            <div className="serverboxdiv1">
                                <div className="serverbox">
                                    <div className="serverboxhead">
                                        <span className="serverboxspan">
                                        <svg  className="serverboxicon feather feather-server" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                                        <b>STATUS</b>
                                        </span>
                                    </div>
                                    <div className="serverboxfoot flex relative ">
                                        <div className="felx" css="display: flex;width: 100%;">
                                            <div css="white-space: nowrap;width: 50%;margin-right:10px;">
                                                {status == 'starting' ?
                                                    <div className={'flex gap-x-2 items-center'}>
                                                        <span className={'flex gap-x-2 items-center'}>
                                                        <div css='width:20px;height:20px;background-color:#fd9f00;border-radius:60px;'/>
                                                        <b>Starting...</b>
                                                        </span>
                                                    </div>
                                                :
                                                <>
                                                {status == 'stopping' ?
                                                    <div className={'flex gap-x-2 items-center'}>
                                                        <span className={'flex gap-x-2 items-center'}>
                                                        <div css='width:20px;height:20px;background-color:#EF4444;border-radius:60px;'/>
                                                        <b>Stopping...</b>
                                                        </span>
                                                    </div>
                                                :
                                                <>
                                                {status == 'offline' ?
                                                    <div className={'flex gap-x-2 items-center'}>
                                                        <span className={'flex gap-x-2 items-center'}>
                                                        <div css='width:20px;height:20px;background-color:#EF4444;border-radius:60px;'/>
                                                        <b>Offline</b>
                                                        </span>
                                                    </div>
                                                :
                                                    <div className={'flex gap-x-2 items-center'}>
                                                        <span className={'flex gap-x-2 items-center'}>
                                                        <div css='width:20px;height:20px;background-color:#21b149;border-radius:60px;'/>
                                                        <b>Running...</b>
                                                        </span>
                                                    </div>
                                                }
                                                </>    
                                                }
                                                </>
                                                }
                                            </div>
                                            <div css="white-space: nowrap;width: 50%;text-align: right;">
                                                {status === null ? (
                                                    ''
                                                ) :(
                                                    <UptimeDuration uptime={stats.uptime / 1000} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="serverboxdiv">
                                <div className="serverbox">
                                    <div className="serverboxhead">
                                        <span className="serverboxspan">
                                        <svg className="serverboxicon" fill="white" width="20px" height="20px" viewBox="0 -32 576 576" xmlns="http://www.w3.org/2000/svg"><path d="M560 288h-80v96l-32-21.3-32 21.3v-96h-80c-8.8 0-16 7.2-16 16v192c0 8.8 7.2 16 16 16h224c8.8 0 16-7.2 16-16V304c0-8.8-7.2-16-16-16zm-384-64h224c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16h-80v96l-32-21.3L256 96V0h-80c-8.8 0-16 7.2-16 16v192c0 8.8 7.2 16 16 16zm64 64h-80v96l-32-21.3L96 384v-96H16c-8.8 0-16 7.2-16 16v192c0 8.8 7.2 16 16 16h224c8.8 0 16-7.2 16-16V304c0-8.8-7.2-16-16-16z"/></svg>
                                        <b>IP ADDRESS</b>
                                        </span>
                                    </div>
                                    <div className="serverboxfoot">
                                    <StatBlock copyOnClick={allocation}>
                                        <div>
                                            {pteroxSettings["iphider"].value === 'No'  || pteroxSettings["iphider"].value === 'no' ?
                                                <>
                                                    <b>
                                                        {allocation}
                                                    </b>
                                                </>
                                                :
                                                <>
                                                    <b css="background: var(--ptx-border);height: 100%;width: 100%;color: transparent;" className="duration-150 hover:text-[color:var(--ptx-text)] hover:bg-[color:var(--ptx-secondary)] hover:opacity-100 opacity-50">
                                                        {allocation}
                                                    </b>

                                                </>
                                            }
                                        </div>
                                    </StatBlock>
                                    </div>
                                </div>
                            </div>
                            <div className="serverboxdiv">
                                <div className="serverbox">
                                    <div className="serverboxhead">
                                        <span className="serverboxspan">
                                        <svg className="serverboxicon" fill="white" width="22px" height="22px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <g>
                                                <path fill="none" d="M0 0h24v24H0z"/>
                                                <path d="M3 7l8.445-5.63a1 1 0 0 1 1.11 0L21 7v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zm2 1.07V20h14V8.07l-7-4.666L5 8.07zM12 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                                            </g>
                                        </svg>
                                        <b>SUPPORT ID</b>
                                        </span>
                                    </div>
                                    <div className="serverboxfoot">
                                        <StatBlock copyOnClick={id}>
                                            <b>
                                            {id}
                                            </b>
                                        </StatBlock>
                                    </div>
                                </div>
                            </div>
                            <div className="serverboxdiv1">
                                <div className="serverbox">
                                    <div className="serverboxhead">
                                        <span className="serverboxspan">
                                        <svg className="serverboxicon feather feather-cpu" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                        <b>CPU</b>
                                        </span>
                                    </div>
                                    <div className="serverboxfoot">
                                        <div>
                                         <b>{stats.cpu.toFixed(2)}%</b> / <span className="serverboxfootspan">{textLimits.cpu || 'Unlimited'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="serverboxdiv">
                                <div className="serverbox">
                                    <div className="serverboxhead">
                                        <span className="serverboxspan">
                                        <svg className="serverboxicon" width="20px" fill="white" height="20px" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg"><path d="M640 130.94V96c0-17.67-14.33-32-32-32H32C14.33 64 0 78.33 0 96v34.94c18.6 6.61 32 24.19 32 45.06s-13.4 38.45-32 45.06V320h640v-98.94c-18.6-6.61-32-24.19-32-45.06s13.4-38.45 32-45.06zM224 256h-64V128h64v128zm128 0h-64V128h64v128zm128 0h-64V128h64v128zM0 448h64v-26.67c0-8.84 7.16-16 16-16s16 7.16 16 16V448h128v-26.67c0-8.84 7.16-16 16-16s16 7.16 16 16V448h128v-26.67c0-8.84 7.16-16 16-16s16 7.16 16 16V448h128v-26.67c0-8.84 7.16-16 16-16s16 7.16 16 16V448h64v-96H0v96z"/></svg>
                                        <b>RAM</b>
                                        </span>
                                    </div>
                                    <div className="serverboxfoot">
                                        <div>
                                        <b>{bytesToString(stats.memory)}</b> / <span className="serverboxfootspan">{textLimits.memory || 'Unlimited'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="serverboxdiv">
                                <div className="serverbox">
                                    <div className="serverboxhead">
                                        <span className="serverboxspan">
                                        <svg className="serverboxicon" fill="white" width="22px" height="22px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <g>
                                                <path fill="none" d="M0 0h24v24H0z"/>
                                                <path d="M19 12H5v8h14v-8zM5 10V2h14v8h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1zm2 0h10V4H7v6zm2-4h2v2H9V6zm4 0h2v2h-2V6z"/>
                                            </g>
                                        </svg>
                                        <b>STORAGE</b>
                                        </span>
                                    </div>
                                    <div className="serverboxfoot">
                                        <div>
                                        <b>{bytesToString(stats.disk)}</b> / <span className="serverboxfootspan">{textLimits.disk || 'Unlimited'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </ConsoleServerDetails>
    );
};

export default ServerDetailsBlock;
