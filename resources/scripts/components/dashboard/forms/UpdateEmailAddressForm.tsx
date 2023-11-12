import React from 'react';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Field from '@/components/elements/Field';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import styled from 'styled-components/macro';

const Buttons = styled.div`
    .buttonscss {
        position: relative;
        display: inline-block;
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
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
`;

interface Values {
    email: string;
    password: string;
}

const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required('You must provide your current account password.'),
});

export default () => {
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const updateEmail = useStoreActions((state: Actions<ApplicationStore>) => state.user.updateUserEmail);

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const submit = (values: Values, { resetForm, setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('account:email');

        updateEmail({ ...values })
            .then(() =>
                addFlash({
                    type: 'success',
                    key: 'account:email',
                    message: 'Your primary email has been updated.',
                })
            )
            .catch((error) =>
                addFlash({
                    type: 'error',
                    key: 'account:email',
                    title: 'Error',
                    message: httpErrorToHuman(error),
                })
            )
            .then(() => {
                resetForm();
                setSubmitting(false);
            });
    };

    return (
        <Formik onSubmit={submit} validationSchema={schema} initialValues={{ email: user!.email, password: '' }}>
            {({ isSubmitting, isValid }) => (
                <React.Fragment>
                    <SpinnerOverlay size={'large'} visible={isSubmitting} />
                    <Form css={tw`m-0`}>
                        <Field id={'current_email'} type={'email'} name={'email'} label={'Email'} />
                        <div css={tw`mt-6`}>
                            <Field
                                id={'confirm_password'}
                                type={'password'}
                                name={'password'}
                                label={'Confirm Password'}
                            />
                        </div>
                        <Buttons>
                        <div css={tw`mt-6`}>
                            <Button disabled={isSubmitting || !isValid} className="buttonscss">Update Email</Button>
                        </div>
                        </Buttons>
                    </Form>
                </React.Fragment>
            )}
        </Formik>
    );
};
