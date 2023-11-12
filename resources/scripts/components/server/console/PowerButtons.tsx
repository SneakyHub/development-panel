import React, { useEffect, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import styled1 from 'styled-components/macro';

interface PowerButtonProps {
    className?: string;
}

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

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

    const ServerButton = styled1.div`

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
            color: var(--textColor);
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
            fill: var(--textColor);
        }
        .spanbutton {
            color: var(--textColor);
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
        <ServerButton>
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
        </ServerButton>
    );
};
