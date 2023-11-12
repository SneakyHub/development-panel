import React, { useContext, useEffect, useState } from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import Field from '@/components/elements/Field';
import { Form, Formik, FormikHelpers } from 'formik';
import FormikSwitch from '@/components/elements/FormikSwitch';
import createOrUpdateSchedule from '@/api/server/schedules/createOrUpdateSchedule';
import { ServerContext } from '@/state/server';
import { httpErrorToHuman } from '@/api/http';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import ModalContext from '@/context/ModalContext';
import asModal from '@/hoc/asModal';
import Switch from '@/components/elements/Switch';
import ScheduleCheatsheetCards from '@/components/server/schedules/ScheduleCheatsheetCards';
import styled1 from 'styled-components/macro';


interface Props {
    schedule?: Schedule;
}

interface Values {
    name: string;
    dayOfWeek: string;
    month: string;
    dayOfMonth: string;
    hour: string;
    minute: string;
    enabled: boolean;
    onlyWhenOnline: boolean;
}

const EditScheduleModal = ({ schedule }: Props) => {
    const { addError, clearFlashes } = useFlash();
    const { dismiss } = useContext(ModalContext);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const appendSchedule = ServerContext.useStoreActions((actions) => actions.schedules.appendSchedule);
    const [showCheatsheet, setShowCheetsheet] = useState(false);

    useEffect(() => {
        return () => {
            clearFlashes('schedule:edit');
        };
    }, []);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('schedule:edit');
        createOrUpdateSchedule(uuid, {
            id: schedule?.id,
            name: values.name,
            cron: {
                minute: values.minute,
                hour: values.hour,
                dayOfWeek: values.dayOfWeek,
                month: values.month,
                dayOfMonth: values.dayOfMonth,
            },
            onlyWhenOnline: values.onlyWhenOnline,
            isActive: values.enabled,
        })
            .then((schedule) => {
                setSubmitting(false);
                appendSchedule(schedule);
                dismiss();
            })
            .catch((error) => {
                console.error(error);

                setSubmitting(false);
                addError({ key: 'schedule:edit', message: httpErrorToHuman(error) });
            });
    };

    const Savebtn = styled1.div`

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
        <Formik
            onSubmit={submit}
            initialValues={
                {
                    name: schedule?.name || '',
                    minute: schedule?.cron.minute || '*/5',
                    hour: schedule?.cron.hour || '*',
                    dayOfMonth: schedule?.cron.dayOfMonth || '*',
                    month: schedule?.cron.month || '*',
                    dayOfWeek: schedule?.cron.dayOfWeek || '*',
                    enabled: schedule?.isActive ?? true,
                    onlyWhenOnline: schedule?.onlyWhenOnline ?? true,
                } as Values
            }
        >
            {({ isSubmitting }) => (
                <Form css={tw`text-2xl mb-3`}>
                    <h3 css={tw`text-2xl mb-3 text-[color:var(--ptx-text)]`}>{schedule ? 'Edit schedule' : 'Create new schedule'}</h3>
                    <FlashMessageRender byKey={'schedule:edit'} css={tw`mb-6`} />
                    <Field
                        name={'name'}
                        label={'Schedule name'}
                        description={'A human readable identifier for this schedule.'}
                    />
                    <div css={tw`grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6`}>
                        <Field name={'minute'} label={'Minute'} />
                        <Field name={'hour'} label={'Hour'} />
                        <Field name={'dayOfMonth'} label={'Day of month'} />
                        <Field name={'month'} label={'Month'} />
                        <Field name={'dayOfWeek'} label={'Day of week'} />
                    </div>
                    <p css={tw`text-neutral-400 text-xs mt-2`}>
                        The schedule system supports the use of Cronjob syntax when defining when tasks should begin
                        running. Use the fields above to specify when these tasks should begin running.
                    </p>
                    <div css={tw`mt-3 bg-neutral-700 p-4 rounded`}>
                        <Switch
                            name={'show_cheatsheet'}
                            description={'Show the cron cheatsheet for some examples.'}
                            label={'Show Cheatsheet'}
                            defaultChecked={showCheatsheet}
                            onChange={() => setShowCheetsheet((s) => !s)}
                        />
                        {showCheatsheet && (
                            <div css={tw`block md:flex w-full`}>
                                <ScheduleCheatsheetCards />
                            </div>
                        )}
                    </div>
                    <div css={tw`mt-3 bg-neutral-700 p-4 rounded`}>
                        <FormikSwitch
                            name={'onlyWhenOnline'}
                            description={'Only execute this schedule when the server is in a running state.'}
                            label={'Only When Server Is Online'}
                        />
                    </div>
                    <div css={tw`mt-3 bg-neutral-700 p-4 rounded`}>
                        <FormikSwitch
                            name={'enabled'}
                            description={'This schedule will be executed automatically if enabled.'}
                            label={'Schedule Enabled'}
                        />
                    </div>
                    <div css={tw`mt-4 text-right`}>
                        <Savebtn>
                        <Button className={'w-full sm:w-auto uploadbtn'} type={'submit'} disabled={isSubmitting}>
                            {schedule ? 'Save changes' : 'Create schedule'}
                        </Button>
                        </Savebtn>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default asModal<Props>()(EditScheduleModal);
