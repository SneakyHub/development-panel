import React, { useCallback, useState } from 'react';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { Button } from '@/components/elements/button/index';
import triggerScheduleExecution from '@/api/server/schedules/triggerScheduleExecution';
import { ServerContext } from '@/state/server';
import useFlash from '@/plugins/useFlash';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import styled1 from 'styled-components/macro';

const RunScheduleButton = ({ schedule }: { schedule: Schedule }) => {
    const [loading, setLoading] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const appendSchedule = ServerContext.useStoreActions((actions) => actions.schedules.appendSchedule);

    const onTriggerExecute = useCallback(() => {
        clearFlashes('schedule');
        setLoading(true);
        triggerScheduleExecution(id, schedule.id)
            .then(() => {
                setLoading(false);
                appendSchedule({ ...schedule, isProcessing: true });
            })
            .catch((error) => {
                console.error(error);
                clearAndAddHttpError({ error, key: 'schedules' });
            })
            .then(() => setLoading(false));
    }, []);

    const RunNowbtn = styled1.div`

        .uploadbtn {
            background: linear-gradient(267.71deg, #007CEE -37.36%, #007CEE 98.08%);
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
                background: linear-gradient(267.71deg, #007CEE -37.36%, #0067C6 98.08%);
            }
        }
    }

`;
    return (
        <>
            <SpinnerOverlay visible={loading} size={'large'} />
            <RunNowbtn>
            <Button
                variant={Button.Variants.Secondary}
                disabled={schedule.isProcessing}
                onClick={onTriggerExecute}
                className="uploadbtn flex-1 sm:flex-none"
            >
                Run Now
            </Button>
            </RunNowbtn>
        </>
    );
};

export default RunScheduleButton;
