import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogWrapperContext } from '@/components/elements/dialog';
import getTwoFactorTokenData, { TwoFactorTokenData } from '@/api/account/getTwoFactorTokenData';
import { useFlashKey } from '@/plugins/useFlash';
import tw from 'twin.macro';
import QRCode from 'qrcode.react';
import { Button } from '@/components/elements/button/index';
import Spinner from '@/components/elements/Spinner';
import { Input } from '@/components/elements/inputs';
import CopyOnClick from '@/components/elements/CopyOnClick';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import enableAccountTwoFactor from '@/api/account/enableAccountTwoFactor';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import asDialog from '@/hoc/asDialog';
import styled from 'styled-components/macro';


const FormCss = styled.button`
    .formbody {
        margin-bottom: 0px;
        margin: 0px;
    }

    .div2 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    .qrcodediv {
        width: 100%;

        @media (min-width: 768px) {
            -webkit-flex: 1 1 0%;
            -ms-flex: 1 1 0%;
            flex: 1 1 0%;
        }
    }

    .qrcode {
        width: 8rem;
        height: 8rem;
        --tw-bg-opacity: 1;
        background-color: hsla(209,14%,37%,var(--tw-bg-opacity));
        padding: 0.5rem;
        border-radius: 0.25rem;
        margin-left: auto;
        margin-right: auto;

        @media (min-width: 768px) {
            width: 13rem;
            height: 13rem;
        }
    }
    .inputdivs {
        width: 100%;
        margin-top: 1.5rem;

        @media (min-width: 768px) {
            margin-top: 0px;
            -webkit-flex: 1 1 0%;
            -ms-flex: 1 1 0%;
            flex: 1 1 0%;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-flex-direction: column;
            -ms-flex-direction: column;
            flex-direction: column;
        }
    }
    .inputdivs2 {
        -webkit-flex: 1 1 0%;
        -ms-flex: 1 1 0%;
        flex: 1 1 0%;
    }

    .pragdiv {
        color: var(--ptx-text);
        line-height: 24px;
        font-size: 11px;
        text-align: left;
    }
    .inputcode:not([type="checkbox"]):not([type="radio"]) {
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

    .authcodediv {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top-width: 1px;
        --tw-border-opacity: 1;
        border-color: hsla(211,12%,43%,var(--tw-border-opacity));
        --tw-text-opacity: 1;
    }

    .pragdiv2 {
        color: color: var(--ptx-text);
        line-height: 24px;
        font-size: 13px;
        text-align: left;
    }
    .authcodecopy {
        font-size: 0.875rem;
        line-height: 1.25rem;
        --tw-bg-opacity: 1;
        background-color: var(--ptx-primary);
        border-radius: 0.25rem;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        font-family: "JetBrains Mono",Consolas,monospace;
    }

    .copycode {
        font-family: "JetBrains Mono",Consolas,monospace;
        font-size: 1rem;
        color : var(--ptx-text);
    }

    .setupbtndiv {
        margin-top: 1.5rem;
        text-align: right;

        @media (min-width: 768px) {
            margin-top: 2rem;
        }
    }
    .setupbtn {
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
        background: linear-gradient(267.71deg,#007CEE -37.36%,#007CEE 98.08%);
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        cursor: pointer;
    }
`;

interface Props {
    onTokens: (tokens: string[]) => void;
}

const ConfigureTwoFactorForm = ({ onTokens }: Props) => {
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<TwoFactorTokenData | null>(null);
    const { clearAndAddHttpError } = useFlashKey('account:two-step');
    const updateUserData = useStoreActions((actions: Actions<ApplicationStore>) => actions.user.updateUserData);

    const { close, setProps } = useContext(DialogWrapperContext);

    useEffect(() => {
        getTwoFactorTokenData()
            .then(setToken)
            .catch((error) => clearAndAddHttpError(error));
    }, []);

    useEffect(() => {
        setProps((state) => ({ ...state, preventExternalClose: submitting }));
    }, [submitting]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (submitting) return;

        setSubmitting(true);
        clearAndAddHttpError();
        enableAccountTwoFactor(value, password)
            .then((tokens) => {
                updateUserData({ useTotp: true });
                onTokens(tokens);
            })
            .catch((error) => {
                clearAndAddHttpError(error);
                setSubmitting(false);
            });
    };

    return (
        <FormCss>
        <form id={'enable-totp-form'} onSubmit={submit} className="formbody">
            <div data-tw="flex flex-wrap" className="div2">
            <FlashMessageRender byKey={'account:two-step'} className={'mt-4'} />
            <div className="qrcodediv">
                {!token ? (
                    <Spinner />
                ) : (
                    <QRCode renderAs={'svg'} value={token.image_url_data} className="qrcode" data-tw="w-32 h-32 md:w-64 md:h-64 bg-neutral-600 p-2 rounded mx-auto"/>
                )}
            </div>
            <div data-tw="w-full mt-6 md:mt-0 md:flex-1 md:flex md:flex-col" className="inputdivs">
            <div data-tw="flex-1" className="inputdivs2">
            <div>
                <Input.Text
                    variant={Input.Text.Variants.Loose}
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                    className={'inputcode'}
                    type={'text'}
                    inputMode={'numeric'}
                    autoComplete={'one-time-code'}
                    pattern={'\\d{6}'}
                />
                <p className="pragdiv"><b>Enter the code from your authenticator device after scanning the QR image.</b></p>
                <Input.Text
                    variant={Input.Text.Variants.Loose}
                    className={'inputcode'}
                    type={'password'}
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <p className="pragdiv"><b>Enter account password.</b></p>
            </div>
            <div data-tw="mt-4 pt-4 border-t border-neutral-500" className="authcodediv">
                <p className="pragdiv2">
                Alternatively, enter the following token into your authenticator application:
                </p>
            </div>
            <div data-tw="cursor-pointer" className="authcodecopy">
            <CopyOnClick text={token?.secret}>
                <p data-tw="font-mono" className="copycode">
                    {token?.secret.match(/.{1,4}/g)!.join('') || 'Loading...'}
                </p>
            </CopyOnClick>
            </div>
            <div data-tw="mt-6 md:mt-0 text-right" className="setupbtndiv">
                    <Button className={'setupbtn'}
                        disabled={!token || value.length !== 6  || !password.length} 
                        type={'submit'}
                        form={'enable-totp-form'}
                    >
                        Setup
                    </Button>
            </div>
            </div>
            </div>
            </div>
        </form>
        </FormCss>
    );
};

export default asDialog({
    title: 'Enable Two-Step Verification',
    description:
        "Help protect your account from unauthorized access. You'll be prompted for a verification code each time you sign in.",
})(ConfigureTwoFactorForm);
