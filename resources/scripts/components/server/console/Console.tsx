import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ServerContext } from '@/state/server';
import { usePermissions } from '@/plugins/usePermissions';
import { theme as th } from 'twin.macro';
import useEventListener from '@/plugins/useEventListener';
import { debounce } from 'debounce';
import { usePersistedState } from '@/plugins/usePersistedState';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import classNames from 'classnames';
import styled1 from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';

import 'xterm/css/xterm.css';
import styles from './style.module.css';

const theme = {
    background: th`colors.black`.toString(),
    cursor: 'transparent',
    black: th`colors.black`.toString(),
    red: '#E54B4B',
    green: '#9ECE58',
    yellow: '#FAED70',
    blue: '#396FE2',
    magenta: '#BB80B3',
    cyan: '#2DDAFD',
    white: '#d0d0d0',
    brightBlack: 'rgba(255, 255, 255, 0.2)',
    brightRed: '#FF5370',
    brightGreen: '#C3E88D',
    brightYellow: '#FFCB6B',
    brightBlue: '#82AAFF',
    brightMagenta: '#C792EA',
    brightCyan: '#89DDFF',
    brightWhite: '#ffffff',
    selection: '#FAF089',
};

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'underline',
    allowTransparency: true,
    fontSize: 12,
    fontFamily: th('fontFamily.mono'),
    rows: 30,
    theme: theme,
};

const ConsoleDiv = styled1.div`
    font-size: 0.75rem;
    line-height: 1rem;
    position: relative;
    min-hight: 467.23px;

    .consoledivs {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        padding: 0.5rem;
        width: 100%;
        height: 100%;
        background-color: rgb(19, 26, 32);
        border-width: 2px 2px 0px 2px;
        border-color: rgba(141, 143, 172, 0.5);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    .servercommanddiv {
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        padding-top: 0.5rem;
        background-color: var(--ptx-secondary);
        border-width: 0px 2px 2px;
        border-color: rgba(141, 143, 172, 0.4);
    }
    .servercommanddiv2 {
        -webkit-box-pack: justify;
        justify-content: space-between;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        font-family: "JetBrains Mono", Consolas, monospace;
        border-top-width: 1px;
        --tw-border-opacity: 1;
        border-color: rgba(141,143,172,var(--tw-border-opacity));
    }
    .inputdiv {
        flex: 1 1 0%;
    }
    .inputcontainer {
        transition-property: background-color, border-color, color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        background-color: rgba(0, 0, 0, 0);
        border-width: 0px;
        border-color: rgba(0, 0, 0, 0);
        padding: 0.5rem;
        width: 100%;
        font-family: "JetBrains Mono", Consolas, monospace;
        color: var(--ptx-text);
        font-size: 13px !important;
        line-height: 18px !important;
    }
    .consolebutton {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        gap: 1rem;
    }

    .buttondiv {
        fill: var(--ptx-text);
    }
    .terminaltext {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        flex-shrink: 0;
        padding-right: 0.5rem;
        padding-left: -0.5rem;
        font-weight: 700;
    }
    .strockicon {
        stroke: var(--ptx-text);
    }
}

`;
const ButtonsDiv = styled1.div`


`;

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

    const TERMINAL_PRELUDE = `\u001b[1m\u001b[33m${pteroxSettings["consoleuser"].value}~ \u001b[0m`;
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({ ...terminalProps }), []);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const searchBar = new SearchBarAddon({ searchAddon });
    const webLinksAddon = new WebLinksAddon();
    const scrollDownHelperAddon = new ScrollDownHelperAddon();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [canSendCommands] = usePermissions(['control.console']);
    const serverId = ServerContext.useStoreState((state) => state.server.data!.id);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
    const [historyIndex, setHistoryIndex] = useState(-1);
    // SearchBarAddon has hardcoded z-index: 999 :(
    const zIndex = `
    .xterm-search-bar__addon {
        z-index: 10;
    }`;

    const handleConsoleOutput = (line: string, prelude = false) =>
        terminal.writeln((prelude ? TERMINAL_PRELUDE : '') + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m');

    const handleTransferStatus = (status: string) => {
        switch (status) {
            // Sent by either the source or target node if a failure occurs.
            case 'failure':
                terminal.writeln(TERMINAL_PRELUDE + 'Transfer has failed.\u001b[0m');
                return;
        }
    };
    const clearConsole = () => {
        terminal.clear();
    }

    const handleDaemonErrorOutput = (line: string) =>
        terminal.writeln(
            TERMINAL_PRELUDE + '\u001b[1m\u001b[41m' + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m'
        );

    const handlePowerChangeEvent = (state: string) =>
        terminal.writeln(TERMINAL_PRELUDE + 'Server marked as ' + state + '...\u001b[0m');

    const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, history!.length - 1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';

            // By default up arrow will also bring the cursor to the start of the line,
            // so we'll preventDefault to keep it at the end.
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
        }

        const command = e.currentTarget.value;
        if (e.key === 'Enter' && command.length > 0) {
            setHistory((prevHistory) => [command, ...prevHistory!].slice(0, 32));
            setHistoryIndex(-1);

            instance && instance.send('send command', command);
            e.currentTarget.value = '';
        }
    };

    useEffect(() => {
        if (connected && ref.current && !terminal.element) {
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(searchAddon);
            terminal.loadAddon(searchBar);
            terminal.loadAddon(webLinksAddon);
            terminal.loadAddon(scrollDownHelperAddon);

            terminal.open(ref.current);
            fitAddon.fit();
            searchBar.addNewStyle(zIndex);

            // Add support for capturing keys
            terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                    document.execCommand('copy');
                    return false;
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchBar.show();
                    return false;
                } else if (e.key === 'Escape') {
                    searchBar.hidden();
                }
                return true;
            });
        }
    }, [terminal, connected]);

    useEventListener(
        'resize',
        debounce(() => {
            if (terminal.element) {
                fitAddon.fit();
            }
        }, 100)
    );

    useEffect(() => {
        const listeners: Record<string, (s: string) => void> = {
            [SocketEvent.STATUS]: handlePowerChangeEvent,
            [SocketEvent.CONSOLE_OUTPUT]: handleConsoleOutput,
            [SocketEvent.INSTALL_OUTPUT]: handleConsoleOutput,
            [SocketEvent.TRANSFER_LOGS]: handleConsoleOutput,
            [SocketEvent.TRANSFER_STATUS]: handleTransferStatus,
            [SocketEvent.DAEMON_MESSAGE]: (line) => handleConsoleOutput(line, true),
            [SocketEvent.DAEMON_ERROR]: handleDaemonErrorOutput,
        };

        if (connected && instance) {
            // Do not clear the console if the server is being transferred.
            if (!isTransferring) {
                terminal.clear();
            }

            Object.keys(listeners).forEach((key: string) => {
                instance.addListener(key, listeners[key]);
            });
            instance.send(SocketRequest.SEND_LOGS);
        }

        return () => {
            if (instance) {
                Object.keys(listeners).forEach((key: string) => {
                    instance.removeListener(key, listeners[key]);
                });
            }
        };
    }, [connected, instance]);

    return (
        <ConsoleDiv>
            <SpinnerOverlay visible={!connected} size={'large'} />
            <div
                className="rounded-t-lg p-2 w-full bg-black | rounded-b-lg consoledivs"
            >
                <div className={'h-full'}>
                    <div id={styles.terminal} ref={ref} />
                </div>
            </div>
            {canSendCommands && (
                <div className="servercommanddiv">
                    <div className="servercommanddiv2">
                        <div className="terminaltext">$</div>
                    <div className="inputdiv">
                    <input
                        className="inputcontainer"
                        type={'text'}
                        placeholder={'Type a command...'}
                        aria-label={'Console command input.'}
                        disabled={!instance || !connected}
                        onKeyDown={handleCommandKeyDown}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                    />
                    </div>
                    <div
                        className={classNames(
                            'text-gray-100 peer-focus:text-gray-50 peer-focus:animate-pulse',
                            styles.command_icon
                        )}
                    >
                    </div>
                    <div className="consolebutton flex flex-row gap-4">
                        <span className="relative cursor-pointer">
                            <div className="cursor-pointer buttondiv" onClick={() => clearConsole()}>
                                <svg width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <path fill="none" d="M0 0h24v24H0z"/>
                                        <path d="M8.586 8.858l-4.95 4.95 5.194 5.194H10V19h1.172l3.778-3.778-6.364-6.364zM10 7.444l6.364 6.364 2.828-2.829-6.364-6.364L10 7.444zM14 19h7v2h-9l-3.998.002-6.487-6.487a1 1 0 0 1 0-1.414L12.12 2.494a1 1 0 0 1 1.415 0l7.778 7.778a1 1 0 0 1 0 1.414L14 19z"/>
                                    </g>
                                </svg>
                            </div>
                        </span>
                        <span className="relative cursor-pointer">
                            <ButtonsDiv as={Link} to={`/server/${serverId}/console`} target={'_blank'}>
                            <div className="cursor-pointer buttondiv">
                                <svg width="28px" height="28px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" className="strockicon" stroke-width="2" d="M11,9 L19,9 M15,13 L15,5 M17,17 L17,23 L1,23 L1,7 L1,7 L7,7 M7,1 L23,1 L23,17 L7,17 L7,1 Z"/>
                                </svg>
                            </div>
                            </ButtonsDiv>
                        </span>
                    </div>
                    </div>
                </div>
            )}
        </ConsoleDiv>
    );
};
