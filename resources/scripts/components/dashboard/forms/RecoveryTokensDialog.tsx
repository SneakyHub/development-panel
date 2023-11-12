import React from 'react';
import { Dialog, DialogProps } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { Alert } from '@/components/elements/alert';
import styled from 'styled-components/macro';

const Recovery = styled.div`
    .headingenable {
        font-size: 1.5rem;
        line-height: 2rem;
        margin-bottom: 1rem;
        color: var(--ptx-text);
    }

    .pra {
        --tw-text-opacity: 1;
        color: var(--ptx-text);
        font-size: 1rem;
    }
    .prediv {
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-top: 1rem;
        border-radius: 0.25rem;
        font-family: "JetBrains Mono",Consolas,monospace;
        --tw-bg-opacity: 1;
        background-color: hsla(210,24%,16%,var(--tw-bg-opacity));
        padding: 1rem;
    }

    .closebtn {
        margin-top: 1.5rem;
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

    .closebtndiv {
        text-align: right;
    }
`;

interface RecoveryTokenDialogProps extends DialogProps {
    tokens: string[];
}

export default ({ tokens, open, onClose }: RecoveryTokenDialogProps) => {
    const grouped = [] as [string, string][];
    tokens.forEach((token, index) => {
        if (index % 2 === 0) {
            grouped.push([token, tokens[index + 1] || '']);
        }
    });

    return (
        <Recovery>
        <Dialog
            open={open}
            onClose={onClose}
            title={'Two-Step Authentication Enabled'}
            description={
                'Store the codes below somewhere safe. If you lose access to your phone you can use these backup codes to sign in.'
            }
            hideCloseIcon
            preventExternalClose
        >
        <div>
            <h2 data-tw="text-2xl mb-4" className="headingenable">Two-factor authentication enabled</h2>
            <p className="pra">Two-factor authentication has been enabled on your account. Should you lose access to your authenticator device, you'll need to use one of the codes displayed below in order to access your account.</p>
            <p data-tw="mt-4" className="pra"><strong>These codes will not be displayed again. </strong>Please take note of them now by storing them in a secure repository such as a password manager.</p>
            <Dialog.Icon position={'container'} type={'success'} />
            <CopyOnClick text={tokens.join('\n')} showInNotification={false}>
                <pre data-tw="text-sm mt-4 rounded font-mono p-4" className="prediv">
                    {grouped.map((value) => (
                        <span key={value.join('_')} className={'block'}>
                            {value[0]}
                            <span className={'mx-2 selection:bg-gray-800'}>&nbsp;</span>
                            {value[1]}
                            <span className={'selection:bg-gray-800'}>&nbsp;</span>
                        </span>
                    ))}
                </pre>
            </CopyOnClick>
            <Alert type={'danger'} className={'mt-3'}>
                These codes will not be shown again.
            </Alert>
            <div data-tw="text-right" className="closebtndiv">
            <Button.Text onClick={onClose} data-tw="mt-6" className="closebtn">
                Close
            </Button.Text>
            </div>
        </div>
        </Dialog>
        </Recovery>
    );
};
