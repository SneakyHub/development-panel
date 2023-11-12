import * as React from 'react';
import { useEffect, useState } from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import MessageBox from '@/components/MessageBox';
import { useStoreState } from 'easy-peasy';
import { useLocation } from 'react-router-dom';
import CreateApiKeyForm from '@/components/dashboard/forms/CreateApiKeyForm';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { Dialog } from '@/components/elements/dialog';
import getApiKeys, { ApiKey } from '@/api/account/getApiKeys';
import Code from '@/components/elements/Code';
import { useFlashKey } from '@/plugins/useFlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import deleteApiKey from '@/api/account/deleteApiKey';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { format } from 'date-fns';  
import FlashMessageRender from '@/components/FlashMessageRender';

const Heading = styled.div`
    
    .heading {
        margin-bottom: 0.625rem;
        user-select: none;
        font-weight: 700;
        font-size: 2.25rem;
        line-height: 2.5rem;
        color: var(--ptx-text);

        @media (min-width: 768px) {
            display: flex;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
        }
    }
    

`;

const ContainerAPI = styled.div`

    .heading {
        margin-bottom: 0.625rem;
        margin-top: 4.25rem;
        user-select: none;
        font-weight: 700;
        font-size: 2.25rem;
        line-height: 2.5rem;
        color: var(--ptx-text);

        @media (min-width: 768px) {
            display: flex;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
        }
    }
    .heading2 {
        margin-bottom: 0.5rem;
        padding-right: 1rem;
        font-family: "IBM Plex Sans", "Roboto", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
        font-size: 1.25rem;
        line-height: 1.75rem;
        font-weight: 500;
        --tw-text-opacity: 1;
        color: hsla(216, 33%, 97%, var(--tw-text-opacity));
    }
    .contentbox {
        background: var(--ptx-secondary);
        border: 1px solid rgba(141, 143, 172, 0.1);
        border-radius: 8px;
        padding: 1rem;
    }
    .delbutton {
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
        cursor: pointer;
        background: linear-gradient(267.71deg, #ee5253 -37.36%, #ee5253 98.08%);
    }


`;

const ContainerAccount = styled.div`
    margin-top: -45px;
    margin-bottom: -45px;
    padding-top: 45px;
    .container {
        margin-left: 0 !important;
        -webkit-transition: all .3s;
        transition: all .3s;
    }

    .accountover {
        padding-top: 90px;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        -webkit-transition: all .3s;
        transition: all .3s;
    }

    .grids {
        display: grid;
        gap: 0.625rem;

        @media (min-width: 1000px) {
            grid-template-columns: repeat(3,minmax(0,1fr));
            gap: 1.75rem;
        }
    }

    .updatepass {
        width: 100%;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        gap: 0.625rem;
    }
    .updatepassgui {
        background: var(--ptx-secondary);
        border: 1px solid rgba(141, 143, 172, 0.1);
        border-radius: 8px;
        padding: 1rem;
        position: relative;
    }
`;

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('sm')`
      width: calc(50% - 1rem);
    `}

        ${breakpoint('md')`
      ${tw`w-auto flex-1`};
    `}
    }
`;

export default () => {
    const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();
    const name = useStoreState(state => state.user.data?.username);
    const useremail = useStoreState(state => state.user.data?.email);
    const user_email = String(useremail);
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);
    const [loading, setLoading] = useState(true);
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [deleteIdentifier, setDeleteIdentifier] = useState('');
    const { clearAndAddHttpError } = useFlashKey('account');
    

    useEffect(() => {
        getApiKeys()
            .then((keys) => setKeys(keys))
            .then(() => setLoading(false))
            .catch((error) => clearAndAddHttpError(error));
    }, []);

    const doDeletion = (identifier: string) => {
        setLoading(true);

        clearAndAddHttpError();
        deleteApiKey(identifier)
            .then(() => setKeys((s) => [...(s || []).filter((key) => key.identifier !== identifier)]))
            .catch((error) => clearAndAddHttpError(error))
            .then(() => {
                setLoading(false);
                setDeleteIdentifier('');
            });
    };
    return (
        <PageContentBlock title={'Account Overview'}>
            <ContainerAccount>
            <Heading>
                <h1 className="heading" data-tw="mb-2.5 hidden md:flex select-none font-bold text-4xl">Account Overview</h1>
            </Heading>
            {state?.twoFactorRedirect && (
                <MessageBox title={'2-Factor Required'} type={'error'}>
                    Your account must have two-factor authentication enabled in order to continue.
                </MessageBox>
            )}
            <div data-tw="grid gap-2.5 xl:grid-cols-3 xl:gap-7" className="grids" >
                <div data-tw="w-full flex flex-col gap-2.5" className="updatepass">
                <div data-tw="p-4 relative | border-t-4 | h-full!" className="updatepassgui">
                <ContentBox title={'Update Password'} showFlashes={'account:password'}>
                    <UpdatePasswordForm />
                </ContentBox>
                </div>
                </div>
                <div data-tw="w-full flex flex-col gap-2.5" className="updatepass">
                <div data-tw="p-4 relative | border-t-4 | h-full!" className="updatepassgui">
                <ContentBox css={tw``} title={'Update Email Address'} showFlashes={'account:email'}>
                    <UpdateEmailAddressForm />
                </ContentBox>
                </div>
                </div>
                <div data-tw="w-full flex flex-col gap-2.5" className="updatepass">
                <div data-tw="p-4 relative | border-t-4 | h-full!" className="updatepassgui">
                <ContentBox css={tw``} title={'Configure Two Factor'}>
                    <ConfigureTwoFactorForm />
                </ContentBox>
                </div>
                </div>
            </div>
            </ContainerAccount>
                
            <ContainerAPI>
            <h1 className="heading" data-tw="hidden md:flex select-none font-bold text-4xl">API Keys</h1>
            <FlashMessageRender byKey={'account'} />
            <div css={tw`md:flex flex-nowrap my-10`} className="contentbox">
                
                <ContentBox title={'Create API Key'} css={tw`flex-none w-full md:w-1/2`} className="contentbox">
                    <CreateApiKeyForm onKeyCreated={(key) => setKeys((s) => [...s!, key])} />
                </ContentBox>
                <ContentBox title={'API Keys'} css={tw`flex-1 overflow-hidden mt-8 md:mt-0 md:ml-8`} className="contentbox">
                    <SpinnerOverlay visible={loading} />
                    <Dialog.Confirm
                        title={'Delete API Key'}
                        confirm={'Delete Key'}
                        open={!!deleteIdentifier}
                        onClose={() => setDeleteIdentifier('')}
                        onConfirmed={() => doDeletion(deleteIdentifier)}
                    >
                        <h2 className="heading2">Confirm key deletion</h2>
                        <p>Are you sure you wish to delete <Code>{deleteIdentifier}</Code> API key? All requests using it will immediately be invalidated and will fail.</p>
                        <div css={tw`flex justify-end mt-6`}>
                    <div className="px-6 py-3 flex items-center justify-end space-x-3 rounded-b">
                    <button type={'button'} onClick={() => doDeletion(deleteIdentifier)} className="delbutton">
                        Delete key
                    </button>
                    </div>
                    </div>
                    </Dialog.Confirm>
                    {keys.length === 0 ? (
                        <p css={tw`text-center text-sm`}>
                            {loading ? 'Loading...' : 'No API keys exist for this account.'}
                        </p>
                    ) : (
                        keys.map((key, index) => (
                            <GreyRowBox
                                key={key.identifier}
                                css={[tw`bg-neutral-600 flex items-center`, index > 0 && tw`mt-2`]}
                            >
                                <FontAwesomeIcon icon={faKey} css={tw`text-neutral-300`} />
                                <div css={tw`ml-4 flex-1 overflow-hidden`}>
                                    <p css={tw`text-sm break-words`}>{key.description}</p>
                                    <p css={tw`text-2xs text-neutral-300 uppercase`}>
                                        Last used:&nbsp;
                                        {key.lastUsedAt ? format(key.lastUsedAt, 'MMM do, yyyy HH:mm') : 'Never'}
                                    </p>
                                </div>
                                <p css={tw`text-sm ml-4 hidden md:block`}>
                                    <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded`}>{key.identifier}</code>
                                </p>
                                <button css={tw`ml-4 p-2 text-sm`} onClick={() => setDeleteIdentifier(key.identifier)}>
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        css={tw`text-neutral-400 hover:text-red-400 transition-colors duration-150`}
                                    />
                                </button>
                            </GreyRowBox>
                        ))
                    )}
                </ContentBox>
 
            </div>
            </ContainerAPI>
        </PageContentBlock>
    );
};
