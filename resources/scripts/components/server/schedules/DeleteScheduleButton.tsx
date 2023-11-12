import React, { useState } from 'react';
import deleteSchedule from '@/api/server/schedules/deleteSchedule';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import { Button } from '@/components/elements/button/index';
import { Dialog } from '@/components/elements/dialog';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import styled1 from 'styled-components/macro';

interface Props {
    scheduleId: number;
    onDeleted: () => void;
}

const Delbtn = styled1.div`
    display: inline-flex;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    align-items: center;
    justify-content: center;
    flex: 1 1 0%;

    @media (min-width: 640px) {
        flex: 0 0 auto;
        margin-top: 0px;
    }
    :hover {
    }
        .uploadbtn {
            background: linear-gradient(267.71deg, rgb(238, 82, 83) -37.36%, rgb(238, 82, 83) 98.08%);
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
                background: linear-gradient(267.71deg, rgb(238, 82, 83) -37.36%, rgb(238, 82, 83) 98.08%);
            }
        }
    }

`;

export default ({ scheduleId, onDeleted }: Props) => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const onDelete = () => {
        setIsLoading(true);
        clearFlashes('schedules');
        deleteSchedule(uuid, scheduleId)
            .then(() => {
                setIsLoading(false);
                onDeleted();
            })
            .catch((error) => {
                console.error(error);

                addError({ key: 'schedules', message: httpErrorToHuman(error) });
                setIsLoading(false);
                setVisible(false);
            });
    };

    return (
        <>
            <Dialog.Confirm
                open={visible}
                onClose={() => setVisible(false)}
                title={'Delete Schedule'}
                confirm={'Delete'}
                onConfirmed={onDelete}
            >
                <SpinnerOverlay visible={isLoading} />
                All tasks will be removed and any running processes will be terminated.
            </Dialog.Confirm>

            <Delbtn>
                <Button type={'button'} onClick={() => setVisible(true)} className="uploadbtn">
                    Delete
                </Button>
            </Delbtn>

        </>
    );
};
