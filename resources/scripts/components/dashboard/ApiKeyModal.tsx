import React, { useContext } from 'react';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import asModal from '@/hoc/asModal';
import ModalContext from '@/context/ModalContext';
import CopyOnClick from '@/components/elements/CopyOnClick';
import styled from 'styled-components/macro';


interface Props {
    apiKey: string;
}
const ContainerDiv = styled.div`

    .contentbox {
        background: var(--ptx-secondary);
        border: 1px solid rgba(141, 143, 172, 0.1);
        border-radius: 8px;
    }
    .copybox {
        background: var(--ptx-primary);
    }


`

const ApiKeyModal = ({ apiKey }: Props) => {
    const { dismiss } = useContext(ModalContext);

    return (
        <>
            <ContainerDiv >
            <div className="contentbox"> 
            <h3 css={tw`mb-6 text-2xl`}>Your API Key</h3>
            <p css={tw`text-sm mb-6`}>
                The API key you have requested is shown below. Please store this in a safe location, it will not be
                shown again.
            </p>
            
            <pre css={tw`text-sm rounded py-2 px-4 font-mono`} className="copybox">
                <CopyOnClick text={apiKey}>
                    <code css={tw`font-mono`}>{apiKey}</code>
                </CopyOnClick>
            </pre>
            <div css={tw`flex justify-end mt-6`}>
                <Button type={'button'} onClick={() => dismiss()}>
                    Close
                </Button>
            </div>
            </div>
            </ContainerDiv>
        </>
    );
};

ApiKeyModal.displayName = 'ApiKeyModal';

export default asModal<Props>({
    closeOnEscape: false,
    closeOnBackground: false,
})(ApiKeyModal);
