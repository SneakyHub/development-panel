import React, { useContext, useEffect, useState } from 'react';
import asDialog from '@/hoc/asDialog';
import { Dialog, DialogWrapperContext } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import { Input } from '@/components/elements/inputs';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import disableAccountTwoFactor from '@/api/account/disableAccountTwoFactor';
import { useFlashKey } from '@/plugins/useFlash';
import { useStoreActions } from '@/state/hooks';
import FlashMessageRender from '@/components/FlashMessageRender';
import styled from 'styled-components/macro';

const Disabletfa = styled.div`

    .buttonscssdisabletfa {
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
        background: red;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .disablebtndiv {
        margin-top: 1.5rem;
        text-align: right;
    }

    .labeldiv {
        margin-bottom: 0.25rem;
        color: var(--ptx-text);
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 18px;

        @media (min-width: 640px) {
            margin-bottom: 0.5rem;
        }
    }

    .inputpass:not([type="checkbox"]):not([type="radio"]) {
        resize: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        outline: 2px solid transparent;
        outline-offset: 2px;
        width: 100%;
        min-width: 0px;
        padding: 0.75rem;
        border-width: 2px;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        -webkit-transition-duration: 150ms;
        transition-duration: 150ms;
        --tw-shadow: 0 0 #0000;
        box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);
        background: var(--ptx-primary);
        border: 1px solid var(--ptx-border);
        border-radius: 6px;
        color: #8D8FAC;
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 24px;
    }
    .pradiv {
        color: var(--ptx-text);
        line-height: 24px;
        font-size: 13px;
    }
`;

const DisableTOTPDialog = () => {
    const [submitting, setSubmitting] = useState(false);
    const [password, setPassword] = useState('');
    const { clearAndAddHttpError } = useFlashKey('account:two-step');
    const { close, setProps } = useContext(DialogWrapperContext);
    const updateUserData = useStoreActions((actions) => actions.user.updateUserData);

    useEffect(() => {
        setProps((state) => ({ ...state, preventExternalClose: submitting }));
    }, [submitting]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (submitting) return;

        setSubmitting(true);
        clearAndAddHttpError();
        disableAccountTwoFactor(password)
            .then(() => {
                updateUserData({ useTotp: false });
                close();
            })
            .catch(clearAndAddHttpError)
            .then(() => setSubmitting(false));
    };

    return (
        <Disabletfa>
        <form id={'disable-totp-form'} className={'mt-6'} onSubmit={submit}>
            <div>
            <div>
            <FlashMessageRender byKey={'account:two-step'} className={'-mt-2 mb-6'} />
            <label className={'labeldiv'} htmlFor={'totp-password'}>
                Current Password
            </label>
            <Input.Text
                id={'totp-password'}
                type={'password'}
                className={'inputpass'}
                variant={Input.Text.Variants.Loose}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <p className="pradiv">In order to disable two-factor authentication you will need to provide your account password.</p>
            </div>
                <div className="disablebtndiv" data-tw="mt-6 text-right">
                    <Button.Danger type={'submit'} form={'disable-totp-form'} className="buttonscssdisabletfa" disabled={submitting || !password.length}>
                        Disable Two-Factor
                    </Button.Danger>
                </div>
            </div>
        </form>
        </Disabletfa>
    );
};

export default asDialog({
    title: 'Disable Two-Step Verification',
    description: 'Disabling two-step verification will make your account less secure.',
})(DisableTOTPDialog);
