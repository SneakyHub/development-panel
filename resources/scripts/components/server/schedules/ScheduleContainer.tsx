import React, { useEffect, useState } from 'react';
import getServerSchedules from '@/api/server/schedules/getServerSchedules';
import { ServerContext } from '@/state/server';
import Spinner from '@/components/elements/Spinner';
import { useHistory, useRouteMatch } from 'react-router-dom';
import FlashMessageRender from '@/components/FlashMessageRender';
import ScheduleRow from '@/components/server/schedules/ScheduleRow';
import { httpErrorToHuman } from '@/api/http';
import EditScheduleModal from '@/components/server/schedules/EditScheduleModal';
import Can from '@/components/elements/Can';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { Button } from '@/components/elements/button/index';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import MainServerButton from '@/components/server/MainServerButton';
import styled1 from 'styled-components/macro';

export default () => {
    const match = useRouteMatch();
    const history = useHistory();

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { clearFlashes, addError } = useFlash();
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    const schedules = ServerContext.useStoreState((state) => state.schedules.data);
    const setSchedules = ServerContext.useStoreActions((actions) => actions.schedules.setSchedules);

    useEffect(() => {
        clearFlashes('schedules');
        getServerSchedules(uuid)
            .then((schedules) => setSchedules(schedules))
            .catch((error) => {
                addError({ message: httpErrorToHuman(error), key: 'schedules' });
                console.error(error);
            })
            .then(() => setLoading(false));
    }, []);
    const ScheduleContainer = styled1.div`
    
    .filetext {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        color: var(--ptx-text);
        font-weight: 700;
        font-size: 2.25rem;
        margin-bottom: 0.625rem;
        line-height: 2.5rem;
    }
    .helpdiv {
        padding: 1rem;
        position: relative;
        margin-top: 1rem;
        margin-bottom: 1rem;
        background: var(--ptx-secondary);
        border: 1px solid rgba(141, 143, 172, 0.1);
        border-radius: 8px;
        font-weight: 400;
        color: var(--ptx-text);
    }
    .helplink {
        transition: all 0.3s ease 0s;
        color: rgb(0, 103, 198);
        cursor: pointer;
        font-weight: 400;
    }

    .uploadbtn {

        display: inline-flex;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        align-items: center;
        justify-content: center;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        --tw-text-opacity: 1;
        color: rgba(255, 255, 255, var(--tw-text-opacity));
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 100ms;
        font-weight: 700;
        font-size: 13px;
        line-height: 18px;
        border-radius: 4px /* Sizing Controls */;
        flex: 1 1 0%;
        margin-right: 1rem;

        @media (min-width: 640px) {
            flex: 0 0 auto;
            margin-top: 0px;
        }
        :hover {
      
        }
    }

`;

    return (
        <ScheduleContainer>
        <ServerContentBlock title={'Schedules'}>
            <MainServerButton/>
            <h1 className="filetext mt-4" data-tw="hidden mt-4 md:flex select-none text-main font-bold">Schedules</h1>
            <div className="helpdiv">
            Create schedules here to have tasks automatically executed for your server. These schedules use Cronjob syntax to determine when and how often to run. Please see our<a className="helplink"> Schedule Guide </a>for more details.
            </div>
            <FlashMessageRender byKey={'schedules'} css={tw`mb-4`} />
            {!schedules.length && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <>
                    {schedules.length === 0 ? (
                        <p css={tw`text-sm text-center text-neutral-300 mt-4`}>
                            There are no schedules configured for this server.
                        </p>
                    ) : (
                        schedules.map((schedule) => (
                            <GreyRowBox
                                as={'a'}
                                key={schedule.id}
                                href={`${match.url}/${schedule.id}`}
                                css={tw`cursor-pointer mb-2 flex-wrap mt-4`}
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    history.push(`${match.url}/${schedule.id}`);
                                }}
                            >
                                <ScheduleRow schedule={schedule} />
                            </GreyRowBox>
                        ))
                    )}
                    <Can action={'schedule.create'}>
                        <div css={tw`mt-8 flex justify-end`}>
                            <EditScheduleModal visible={visible} onModalDismissed={() => setVisible(false)} />
                            <Button type={'button'} onClick={() => setVisible(true)} className="uploadbtn">
                                Create schedule
                            </Button>
                        </div>
                    </Can>
                </>
            )}
        </ServerContentBlock>
        </ScheduleContainer>
    );
};
