import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import styled1 from 'styled-components/macro';
import isEqual from 'react-fast-compare';
import Button from '@/components/elements/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { ServerContext } from '@/state/server';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { FaMemory, FaEgg } from 'react-icons/fa';
import { RiUDiskFill, RiCpuLine, RiServerFill } from 'react-icons/ri';
import { HiSupport } from 'react-icons/hi';
import { IconContext } from 'react-icons';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--ptx-secondary)',
    color: 'var(--wp-textcolor)',
    boxShadow: theme.shadows[1],
    fontSize: 15,
    fontWeight: 100,
  },
}));

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled1(FontAwesomeIcon)<{ $alarm: boolean }>`
        ${(props) => (props.$alarm ? tw`text-red-400` : tw`text-neutral-500`)};
    `,
    isEqual
);

const IconDescription = styled1.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2`};
    ${(props) => (props.$alarm ? tw`text-white` : tw`text-neutral-400`)};
`;

const StatusIndicatorBox = styled1.div<{ $status: ServerPowerState | undefined }>`

    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    & .status-bar {
        position: absolute;
        top: -20px;
        right: -243px;
        opacity: .4;
        width: 1.5rem;
        height: 1.5rem;
        z-index: 2;
        border-radius: 15px;

        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500`
                : $status === 'running'
                ? tw`bg-green-500`
                : tw`bg-yellow-500`};
    }

    &:hover .status-bar {
        ${tw`opacity-75`};
    }

    
    

    
`;

const ButtonBox = styled1.div`

& .status-bar {
    height: 0.25rem;
    display: absolute;
    z-index: 20;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    border-radius: 8px;
    width: calc(100% - 10px);
}
    

    
`;

const RowContainer = styled1.div<{ $status: ServerPowerState | undefined }>`

    display: flex;
    max-height: 370px;
    margin-bottom: 20px;
    @media only screen and (max-width: 1150px) {
        min-width: 100%;
    }
    .outerdiv {
        background-color: var(--ptx-secondary);;
        border: 2px solid;
        display: flex;
        flex-direction: column;
        
        max-height: 370px;
        border-radius: 8px;
        margin-bottom: 20px;
        width: 500px;
        position: relative;
        @media only screen and (max-width: 1150px) {
            min-width: 100%;
        }

        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`border-red-500`
                : $status === 'running'
                ? tw`border-green-500`
                : tw`border-yellow-500`};-

        @media only screen and (max-width: 1150px) {
            min-width: 100%;
        }
    }
    .imagediv {
        width: 100%;
        height: 168px !important;
        background-image: url(https://media.discordapp.net/attachments/1072053324842532914/1102616528706355282/pxfuel.jpg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        align-items: center;
        justify-content: center;
        display: flex;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        @media only screen and (max-width: 1150px) {
            width: 100%;
        }
    }
    .servernamediv {
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0, 0.4);
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
        display: flex;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
    }

    .serverIcon {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
    }
    .icon:not(.icon-hover).no-bg {
        background: transparent;
    }
    .icon:not(.icon-hover).w-18 {
        width: 66px;
        height: 66px;
    }
    .icon:not(.icon-hover).p-0 {
        padding: 0px;
    }
    .icon:not(.icon-hover) {
        border-radius: 9999px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        padding: 0.75rem;
        background: var(--ptx-border);
        filter: blur(8px);
        -webkit-filter: blur(8px);
    }

    .icondiv {
        user-select: none;
    }

    .servername {
        color: white;
        word-break: break-all;
        font-weight: 600;
        font-size: 40px;
        padding-left: 25px;
        padding-right: 25px;
    }

    .serverdetails {
        display: flex;
        flex-direction: row;
        gap: 1.25rem;
    }

    .usageinfo {
        flex-wrap: wrap;
        margin: 15px;
        display: inline-block;
        float: left;
        text-align: start;
        justify-content: left;
        height: 95px;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .widths {
        width: 45%;
        display: flex;
    }
    .buttonsdiv {
        max-width: 100%;
        margin: 10px;
        justify-content: space-between;
        display: flex;
    }

    .manage-button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-letter-spacing: 0.025em;
        -moz-letter-spacing: 0.025em;
        -ms-letter-spacing: 0.025em;
        letter-spacing: 0.025em;
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        -webkit-transition-duration: 150ms;
        transition-duration: 150ms;
        font-weight: 700;
        font-size: 13px;
        line-height: 18px;
        border-radius: 4px;
        --tw-text-opacity: 1;
        color: rgba(255,255,255,var(--tw-text-opacity));
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        -webkit-transition-duration: 300ms;
        transition-duration: 300ms;
        background: var(--ptx-button);
        width: 20%;
        border-color: hsla(236,16%,61%,0.1);
        margin-top: auto;
        text-align: center;
        height: 45px;
    }

    .console-button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-letter-spacing: 0.025em;
        -moz-letter-spacing: 0.025em;
        -ms-letter-spacing: 0.025em;
        letter-spacing: 0.025em;
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        -webkit-transition-duration: 150ms;
        transition-duration: 150ms;
        font-weight: 700;
        font-size: 13px;
        line-height: 18px;
        border-radius: 4px;
        --tw-text-opacity: 1;
        color: rgba(255,255,255,var(--tw-text-opacity));
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        -webkit-transition-duration: 300ms;
        transition-duration: 300ms;
        background: var(--ptx-button);
        width: 20%;
        border-color: hsla(236,16%,61%,0.1);
        margin-top: auto;
        text-align: center;
        height: 45px;
    }

    .usageblockdiv {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        width: 100%;
    }
    .usageblock1 {
        order: 0;
    }
    .usageblock2 {
        order: 1;
    }
    .usageblock3 {
        order: 2;
    }
    .usageblock4 {
        order: 3;
    }
    .usageblock5 {
        order: 4;
    }
    .usageblock6 {
        order: 5;
    }

`;
type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);
    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        // Don't waste a HTTP request if there is nothing important to show to the user because
        // the server is suspended.
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

    

    return (
            <RowContainer className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6 widths flex justify-center" $status={stats?.status}>
                <div className="outerdiv m-3 w-full">
                <StatusIndicatorBox as={Link} to={`/server/${server.id}`} className="imagediv" style={{backgroundImage: `url("/pterox/egg/${server.eggId}.png")`}}  $status={stats?.status}> 
                    <div className="w-full h-full">
                        <div className="servernamediv">
                        <div className="top-7 absolute">
                {!stats || isSuspended ? (
                    isSuspended ? (
                        <div css={tw`flex text-center`}>
                            <span css={tw`bg-red-500 rounded px-2 py-1 text-red-100 text-xs h-6 pl-3`}>
                                {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                            </span>
                        </div>
                    ) : server.isTransferring || server.status ? (
                        <div css={tw`flex text-center`}>
                            <span css={tw`bg-neutral-500 rounded px-2 py-1 text-neutral-100 text-xs h-6 pl-3`}>
                                {server.isTransferring
                                    ? 'Transferring'
                                    : server.status === 'installing'
                                    ? 'Installing'
                                    : server.status === 'restoring_backup'
                                    ? 'Restoring Backup'
                                    : 'Unavailable'}
                            </span>
                        </div>
                    ) : (
                        <div css={tw`flex text-center`}>
                            <span css={tw`bg-red-500 rounded px-2 py-1 text-red-100 text-xs h-6 w-20 pl-3`}>
                                Connecting
                            </span>
                        </div>
                    )
                ) : (
                    <div />
                )}
            </div>
                        <span className="servername">{server.name}</span>
                        </div>
                        
                    </div>
                    </StatusIndicatorBox>



                    <div className="usageinfo">
                    {!stats || isSuspended ? (
                    isSuspended ? (
                        <Spinner size={'small'} />
                    ) : (
                        <Spinner size={'small'} />
                    )
                    ) : (
                    <React.Fragment>
                        <div className="usageblockdiv">
                            <div className="usageblock1">
                            <span className="flex"><b><FaMemory className="h-6 w-6 pr-1"/></b><span className="font-semibold"> : {bytesToString(stats.memoryUsageInBytes)}</span></span>
                            </div>
                            <div className="usageblock2">
                            <span className="flex"><b><RiCpuLine className="h-6 w-6 pr-1"/></b><span className="font-semibold"> : {stats.cpuUsagePercent.toFixed(2)} %</span></span>
                            </div>
                            <div className="usageblock3">
                            <span className="flex"><b><RiUDiskFill className="h-6 w-6 pr-1"/></b><span className="font-semibold"> : {bytesToString(stats.diskUsageInBytes)}</span></span>
                            </div>
                            <div className="usageblock4">
                            <span className="flex"><b><FaEgg className="h-6 w-6 pr-1"/></b><span>
                            
                            {server.eggId === 4 ?
                             <>
                                <span className="font-semibold"> : Sponge</span>
                             </>
                             :
                             <>
                                        {server.eggId === 1 ?
                                            <>
                                                <span className="font-semibold"> : Bungeecord</span>
                                            </>
                                        :
                                            <>
                                                            {server.eggId === 2 ?
                                                            <>
                                                                <span className="font-semibold"> : Forge</span>
                                                            </>
                                                            :
                                                            <>
                                                                    {server.eggId === 3 ?
                                                                    <>
                                                                        <span className="font-semibold"> : Paper</span>
                                                                    </>
                                                                    :
                                                                    <>
                                                                            {server.eggId === 5 ?
                                                                            <>
                                                                                <span className="font-semibold"> : Vanilla</span>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <span className="font-semibold"> : Default</span>
                                                                            </>
                                                                            }
                                                                    </>
                                                                    }
                                                            </>
                                                            }
                                            </>
                                        }
                             </>
                            }
                            </span></span>
                            </div>
                            <div className="usageblock5">
                            <span className="flex"><b><RiServerFill className="h-6 w-6 pr-1"/></b><span className="font-semibold"> : {server.node}</span></span>
                            </div>
                            <div className="usageblock6">
                            <span className="flex"><b><HiSupport className="h-6 w-6 pr-1"/> </b><span className="font-semibold"> : {server.id}</span></span>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                </div>
                <div className="buttonsdiv text-center">
                    <LightTooltip title="Console">
                    <ButtonBox className="console-button text-center" as={Link} to={`/server/${server.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24px" height="24px">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </ButtonBox>
                    </LightTooltip>
                    <LightTooltip title="File Manager">
                    <ButtonBox className="manage-button text-center" as={Link} to={`/server/${server.id}/files`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24px" height="24px">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                    </ButtonBox>
                    </LightTooltip>
                    <LightTooltip title="DataBase">
                    <ButtonBox className="console-button text-center" as={Link} to={`/server/${server.id}/databases`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24px" height="24px">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                        </svg>
                    </ButtonBox>
                    </LightTooltip>
                    <LightTooltip title="Settings">
                    <ButtonBox className="manage-button text-center" as={Link} to={`/server/${server.id}/settings`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24px" height="24px">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    </ButtonBox>
                    </LightTooltip>
                </div>
                </div>
                
            </RowContainer>
    );
};
