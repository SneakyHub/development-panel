import * as React from 'react';
import StatBlock from '@/components/server/console/StatBlock';
import { useState, useEffect } from 'react';
import { ip } from '@/lib/formatters';
import styled1 from 'styled-components/macro';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import { useStoreState, State } from 'easy-peasy';
import { ApplicationStore } from '@/state';






export default () => {
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




    
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const nestId = ServerContext.useStoreState((state) => state.server.data?.nestId);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    const name = ServerContext.useStoreState((state) => state.server.data!.name);

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);

    const allocation = ServerContext.useStoreState(state => {
        const match = state.server.data!.allocations.find(allocation => allocation.isDefault);

        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    const MainServerButton = styled1.div`
        border-bottom-left-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        border-color: rgba(141, 143, 172, 0.4);
        border-width: 2px;
        background-color: var(--ptx-secondary);
        max-width: 100%;
        @media screen and (min-width: 80em) {
            margin-left: auto;
            margin-right: auto;
        }

        .div2 {
            gap: 1rem;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            display: grid;
            padding: 1.5rem;
        }

        .div3 {
            grid-column: span 4 / span 4;
            display: block;
            @media (min-width: 1024px) {
                padding-right: 1rem;
                grid-column: span 3 / span 3;
            }
        }

        .namerow {
            align-items: center;
            flex-direction: row;
            display: flex;
        }
        .detailrow {
            flex-direction: column;
            display: flex;
            @media (min-width: 640px) {
                flex-direction: row;
            }
        }
        .nameh1 {
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
            display: flex;
            @media (min-width: 768px) {
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
            }
            font-family: "Inter", "Roboto", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
        }
        .iconsvg {
            fill: var(--ptx-text);
        }
        .spanbutton {
            color: var(--ptx-text);
        }
        .startbutton {
            margin-left: 5px;
            margin-right: 5px;
            flex-basis: 100%;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            font-weight: 600;
            line-height: 1.25rem;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            background-color: rgba(41, 98, 255, var(--tw-bg-opacity));
            --tw-border-opacity: 1;
            border-color: rgba(41, 98, 255, var(--tw-border-opacity));
            border-width: 1px;
            border-radius: 0.5rem;
            flex: 1 1 0%;
            --tw-bg-opacity: 1;
            :hover {
                --tw-bg-opacity: 0.2;
            }
            :disabled {
                --tw-bg-opacity: 0.2;
                cursor: not-allowed;
            }
            @media (max-width: 640px) {
                margin-bottom: 5px;
            }

        }
        .restartbutton {
            margin-left: 5px;
            margin-right: 5px;
            flex-basis: 100%;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            font-weight: 600;
            line-height: 1.25rem;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            background-color: rgba(253, 159, 0, var(--tw-bg-opacity));
            --tw-border-opacity: 1;
            border-color: rgba(253, 159, 0, var(--tw-border-opacity));
            border-width: 1px;
            border-radius: 0.5rem;
            flex: 1 1 0%;
            --tw-bg-opacity: 1;
            :hover {
                --tw-bg-opacity: 0.2;
            }
            :disabled {
                --tw-bg-opacity: 0.2;
                cursor: not-allowed;
            }
            @media (max-width: 640px) {
                margin-bottom: 5px;
            }

        }
        .stopbutton {
            margin-left: 5px;
            margin-right: 5px;
            flex-basis: 100%;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            font-weight: 600;
            line-height: 1.25rem;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            background-color: rgba(236, 64, 122, var(--tw-bg-opacity));
            --tw-border-opacity: 1;
            border-color: rgba(236, 64, 122, var(--tw-bg-opacity));
            border-width: 1px;
            border-radius: 0.5rem;
            flex: 1 1 0%;
            --tw-bg-opacity: 1;
            :hover {
                --tw-bg-opacity: 0.2;
            }
            :disabled {
                --tw-bg-opacity: 0.2;
                cursor: not-allowed;
            }
            @media (max-width: 640px) {
                margin-bottom: 5px;
            }

        }
        .killbutton {
            margin-left: 5px;
            margin-right: 5px;
            flex-basis: 100%;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            font-weight: 600;
            line-height: 1.25rem;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            background-color: rgba(239, 68, 68, var(--tw-bg-opacity));
            --tw-border-opacity: 1;
            border-color: rgba(239, 68, 68, var(--tw-bg-opacity));
            border-width: 1px;
            border-radius: 0.5rem;
            flex: 1 1 0%;
            --tw-bg-opacity: 1;
            :hover {
                --tw-bg-opacity: 0.2;
            }
            :disabled {
                --tw-bg-opacity: 0.2;
                cursor: not-allowed;
            }
            @media (max-width: 640px) {
                margin-bottom: 5px;
            }

        }

        .serverbuttonsdiv1 {
            align-self: flex-end;
            grid-column: span 4 / span 4;

            @media (min-width: 1024px) {
                grid-column: span 1 / span 1;
            }
            
        }
        .serverbuttonsdiv2 {
            display: flex;

            @media (min-width: 640px) {
                justify-content: flex-end;
            }
            @media (max-width: 640px) {
                flex-wrap: wrap;
            }
            
        }


    `;

    return (
        <MainServerButton>
            <div className="div2">
                <div className="div3">
                    <div className="namerow">
                        <div>
                            <h1 className="mb-2.5 select-none font-bold text-4xl mr-4 nameh1">{name} 
                            <div className="mt-3 ml-4">
                                {status == 'starting' ?
                                    <div css='width:20px;height:20px;background-color:#fd9f00;border-radius:60px;'/>
                                    :
                                    <>
                                        {status == 'stopping' ?
                                        <div css='width:20px;height:20px;background-color:#583232;border:2px solid #9D1E1E;border-radius:60px;'/>
                                    :
                                    <>
                                    {status == 'offline' ?
                                    <div css='width:20px;height:20px;background-color:#EF4444;border-radius:60px;'/>
                                    :
                                    <div css='width:20px;height:20px;background-color:#21b149;border-radius:60px;'/>
                        }
                        </>
                    }
                    </>
                }
                </div></h1>
                            
                        </div>
                    </div>
                    <div className="detailrow">
                        <span className="flex items-center cursor-pointer spanbutton mr-6"> 
                            <svg width="21px" height="21px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-3 iconsvg">
                                <g>
                                    <path fill="none" d="M0 0h24v24H0z"/>
                                    <path d="M6.116 20.087A9.986 9.986 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10a9.986 9.986 0 0 1-4.116 8.087l-1.015-1.739a8 8 0 1 0-9.738 0l-1.015 1.739zm2.034-3.485a6 6 0 1 1 7.7 0l-1.03-1.766a4 4 0 1 0-5.64 0l-1.03 1.766zM11 13h2l1 9h-4l1-9z"/>
                                </g>
                            </svg>
                            <b>
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
                            </b>
                        </span>
                        <span className="flex items-center cursor-pointer spanbutton">
                            <svg width="21px" height="21px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-3 iconsvg">
                                <g>
                                    <path fill="none" d="M0 0h24v24H0z"/>
                                    <path d="M3 7l8.445-5.63a1 1 0 0 1 1.11 0L21 7v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zm2 1.07V20h14V8.07l-7-4.666L5 8.07zM12 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                                </g>
                            </svg>
                            <b>
                            
                            {nestId === 1 ?
                            <>

                                <StatBlock copyOnClick={id}>
                                    {id}
                                </StatBlock>
                                    </>

                            :
                            <>
                            <div>
                                <StatBlock copyOnClick={id}>
                                    {id}
                                </StatBlock>
                            </div>
                            </>
                            }
                            
                            </b>
                        </span>
                    </div>
                </div>
                <div className="serverbuttonsdiv1">
                <div className="serverbuttonsdiv2">
                    <Dialog.Confirm
                        open={open}
                        hideCloseIcon
                        onClose={() => setOpen(false)}
                        title={'Forcibly Stop Process'}
                        confirm={'Continue'}
                        onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
                    >
                        Forcibly stopping a server can lead to data corruption.
                    </Dialog.Confirm>
                    <Can action={'control.start'}>
                        <button
                            className="startbutton"
                            disabled={status !== 'offline'}
                            onClick={onButtonClick.bind(this, 'start')}
                        >
                            Start
                        </button>
                    </Can>
                    <Can action={'control.restart'}>
                        <button className="restartbutton" disabled={!status} onClick={onButtonClick.bind(this, 'restart')}>
                            Restart
                        </button>
                    </Can>
                    <Can action={'control.stop'}>
                        <button
                            className="stopbutton"
                            disabled={status === 'offline'}
                            onClick={onButtonClick.bind(this, 'stop')}
                        >
                            Stop
                        </button>
                    </Can>
                    <Can action={'control.stop'}>
                        <button
                            className="killbutton"
                            disabled={status === 'offline'}
                            onClick={onButtonClick.bind(this, 'kill')}
                        >
                            Kill
                        </button>
                    </Can>
                </div>
                </div>
            </div>
        </MainServerButton>
    );
};
