import React, { useEffect, useState } from 'react';
import Modal from '@/components/elements/Modal';
import { ServerContext } from '@/state/server';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import { join } from 'path';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import useFlash from '@/plugins/useFlash';
import { WithClassname } from '@/components/types';
import FlashMessageRender from '@/components/FlashMessageRender';
import { object, string } from 'yup';
import http from '@/api/http';
import styled1 from 'styled-components/macro';

interface Values {
    url: string;
}

const schema = object().shape({
    url: string().required('A valid URL must be provided.'),
});

export default ({ className }: WithClassname) => {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [ visible, setVisible ] = useState(false);

    const directory = ServerContext.useStoreState(state => state.files.directory);

    useEffect(() => {
        if (!visible) return;

        return () => {
            clearFlashes('files:fetch-modal');
        };
    }, [ visible ]);

    const submit = ({ url }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        setSubmitting(true);
        http.post(`/api/client/servers/${uuid}/files/pull`, { directory: {directory}, url })
        .then(function () {
            setSubmitting(false);
            setVisible(false);
        })
        .catch(function (error) {
            setSubmitting(false);
            clearAndAddHttpError({ key: 'files:fetch-modal', error });
        })
        .then(() => window.location.reload());
    };
    const BtnFile = styled1.div`
    position: relative;
    display: inline-block;
    width: 100%;
    flex: 0 0 auto;

    @media (min-width: 640px) {
        margin-top: 0px;
        width: auto;
    }
    :hover {
        color: rgba(255, 255, 255, var(--tw-text-opacity));
    }
    .downbtn {
        position: relative;
        display: inline-block;
        letter-spacing: 0.025em;
        font-weight: 700;
        font-size: 13px;
        line-height: 18px;
        border-radius: 4px;
        --tw-text-opacity: 1;
        color: rgba(255,255,255,var(--tw-text-opacity));
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
        background: var(--ptx-button);
        padding: 0.5rem 1rem;
        user-select: none !important;
        width: 100%;
        flex: 0 0 auto;
        margin-top: 1rem;
        border: none;

        @media (min-width: 640px) {
            margin-top: 0px;
            width: auto;
            margin-right: 1rem;
        }
        :hover {
            background: var(--ptx-button);
            color: rgba(255, 255, 255, var(--tw-text-opacity));
        }
    }
    .downbtnin {
        position: relative;
        display: inline-block;
        letter-spacing: 0.025em;
        font-weight: 700;
        font-size: 13px;
        line-height: 18px;
        border-radius: 4px;
        --tw-text-opacity: 1;
        color: rgba(255,255,255,var(--tw-text-opacity));
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
        padding: 0.5rem 1rem;
        user-select: none !important;
        width: 100%;
        flex: 0 0 auto;
        margin-top: 1rem;
        border: none;
        background: var(--ptx-button);
    
        @media (min-width: 640px) {
            margin-top: 0px;
            width: auto;
            margin-right: 1rem;
        }
        :hover {
            background: var(--ptx-button)
            color: rgba(255, 255, 255, var(--tw-text-opacity));
        }
    }
}

`;

    return (
        <>
            <Formik
                onSubmit={submit}
                validationSchema={schema}
                initialValues={{ url: '' }}
            >
                {({ resetForm, isSubmitting, values }) => (
                    <Modal
                        visible={visible}
                        dismissable={!isSubmitting}
                        showSpinnerOverlay={isSubmitting}
                        onDismissed={() => {
                            setVisible(false);
                            resetForm();
                        }}
                    >
                        <FlashMessageRender key={'files:fetch-modal'}/>
                        <Form css={tw`m-0`}>
                            <Field
                                autoFocus
                                id={'url'}
                                name={'url'}
                                label={'File URL'}
                            />
                            <p css={tw`text-xs mt-2 text-neutral-400 break-all`}>
                                <span css={tw`text-neutral-200`}>This file will be fetched to</span>
                                &nbsp;/home/container/
                                {join(directory).replace(/^(\.\.\/|\/)+/, '')}
                            </p>
                            <div css={tw`flex justify-end`}>
                            <BtnFile>
                                <Button css={tw`mt-8`} className="downbtnin">
                                    Download File
                                </Button>
                            </BtnFile>
                            </div>
                        </Form>
                    </Modal>
                )}
            </Formik>
            <BtnFile>
            <Button isSecondary onClick={() => setVisible(true)} className="downbtn">
                Download From URL
            </Button>
            </BtnFile>
        </>
    );
};
