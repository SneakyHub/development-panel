import React from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { ServerContext } from '@/state/server';
import { useStoreState } from 'easy-peasy';
import RenameServerBox from '@/components/server/settings/RenameServerBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import Can from '@/components/elements/Can';
import ReinstallServerBox from '@/components/server/settings/ReinstallServerBox';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { ip } from '@/lib/formatters';
import { Button } from '@/components/elements/button/index';
import MainServerButton from '@/components/server/MainServerButton';
import styled1 from 'styled-components/macro';

export default () => {
    const username = useStoreState((state) => state.user.data!.username);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const sftp = ServerContext.useStoreState((state) => state.server.data!.sftpDetails, isEqual);

    const SettingsContainer = styled1.div`
    
    .filetext {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        color: var(--ptx-text);
        font-weight: 700;
        font-size: 2.25rem;
        margin-bottom: 0.625rem;
        line-height: 2.5rem;
    }
    .helpdiv {
        padding: 1rem;
        position: relative;
        margin-top: 1rem;
        margin-bottom: 1rem;
        background: var(--ptx-secondary);
        border: 1px solid rgba(141, 143, 172, 0.1);
        border-radius: 8px;
        font-weight: 400;
        color: var(--ptx-text);
    }
    .helplink {
        transition: all 0.3s ease 0s;
        color: rgb(0, 103, 198);
        cursor: pointer;
        font-weight: 400;
    }

`;
const SFTPbtn = styled1.div`
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
            background: var(--ptx-button);
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
                background: var(--ptx-button);
            }
        }
    }

`;

    return (
        <SettingsContainer>
        <ServerContentBlock title={'Settings'}>
            <MainServerButton/>
            <h1 className="filetext mt-4" data-tw="hidden mt-4 md:flex select-none text-main font-bold">Settings</h1>
            <FlashMessageRender byKey={'settings'} css={tw`mb-4 mt-4`} />
            <div css={tw`md:flex`}>
                <div css={tw`w-full md:flex-1 md:mr-10`}>
                    <Can action={'file.sftp'}>
                        <TitledGreyBox title={'SFTP Details'} css={tw`mb-6 md:mb-10`}>
                            <div css={tw`font-semibold text-[color:var(--ptx-text)]`}>
                                <Label css={tw` font-bold text-[color:var(--ptx-text)]`}>Server Address</Label>
                                <CopyOnClick text={`sftp://${ip(sftp.ip)}:${sftp.port}`}>
                                    <Input type={'text'} value={`sftp://${ip(sftp.ip)}:${sftp.port}`} readOnly />
                                </CopyOnClick>
                            </div>
                            <div css={tw`mt-6 font-semibold text-[color:var(--ptx-text)]`} >
                                <Label css={tw` font-bold text-[color:var(--ptx-text)]`}>Username</Label>
                                <CopyOnClick css={tw`font-semibold text-[color:var(--ptx-text)]`} text={`${username}.${id}`}>
                                    <Input type={'text'} css={tw`font-semibold text-[color:var(--ptx-text)]`} value={`${username}.${id}`} readOnly />
                                </CopyOnClick>
                            </div>
                            <div css={tw`mt-6 flex items-center`}>
                                <div css={tw`flex-1`}>
                                    <div css={tw`border-l-4 border-cyan-500 p-3`}>
                                        <p css={tw`text-xs font-semibold text-[color:var(--ptx-text)]`}>
                                            Your SFTP password is the same as the password you use to access this panel.
                                        </p>
                                    </div>
                                </div>
                                <SFTPbtn>
                                <div css={tw`ml-4 font-semibold text-[color:var(--ptx-text)]`}>
                                    <a href={`sftp://${username}.${id}@${ip(sftp.ip)}:${sftp.port}`}>
                                        <Button.Text variant={Button.Variants.Secondary} className="uploadbtn">Launch SFTP</Button.Text>
                                    </a>
                                </div>
                                </SFTPbtn>
                            </div>
                        </TitledGreyBox>
                    </Can>
                    <TitledGreyBox title={'Debug Information'} css={tw`mb-6 md:mb-10`}>
                        <div css={tw`flex items-center justify-between text-sm text-[color:var(--ptx-text)]`}>
                            <p css={tw`font-bold text-[color:var(--ptx-text)]`}>Node</p>
                            <code css={tw`font-mono bg-[color:var(--ptx-primary)] rounded py-1 px-2 border border-[color:var(--ptx-border)]`}>{node}</code>
                        </div>
                        <CopyOnClick text={uuid}>
                            <div css={tw`flex items-center justify-between mt-2 text-sm text-[color:var(--ptx-text)]`}>
                                <p css={tw`font-bold text-[color:var(--ptx-text)]`}>Server ID</p>
                                <code css={tw`font-mono bg-[color:var(--ptx-primary)] rounded py-1 px-2 border border-[color:var(--ptx-border)]`}>{uuid}</code>
                            </div>
                        </CopyOnClick>
                    </TitledGreyBox>
                </div>
                <div css={tw`w-full mt-6 md:flex-1 md:mt-0`}>
                    <Can action={'settings.rename'}>
                        <div css={tw`mb-6 md:mb-10`}>
                            <RenameServerBox />
                        </div>
                    </Can>
                    <Can action={'settings.reinstall'}>
                        <ReinstallServerBox />
                    </Can>
                </div>
            </div>
        </ServerContentBlock>
        </SettingsContainer>
    );
};
