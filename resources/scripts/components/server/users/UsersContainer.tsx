import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions, useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import Spinner from '@/components/elements/Spinner';
import AddSubuserButton from '@/components/server/users/AddSubuserButton';
import UserRow from '@/components/server/users/UserRow';
import FlashMessageRender from '@/components/FlashMessageRender';
import getServerSubusers from '@/api/server/users/getServerSubusers';
import { httpErrorToHuman } from '@/api/http';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import tw from 'twin.macro';
import MainServerButton from '@/components/server/MainServerButton';
import styled1 from 'styled-components/macro';

export default () => {
    const [loading, setLoading] = useState(true);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const subusers = ServerContext.useStoreState((state) => state.subusers.data);
    const setSubusers = ServerContext.useStoreActions((actions) => actions.subusers.setSubusers);

    const permissions = useStoreState((state: ApplicationStore) => state.permissions.data);
    const getPermissions = useStoreActions((actions: Actions<ApplicationStore>) => actions.permissions.getPermissions);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    useEffect(() => {
        clearFlashes('users');
        getServerSubusers(uuid)
            .then((subusers) => {
                setSubusers(subusers);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                addError({ key: 'users', message: httpErrorToHuman(error) });
            });
    }, []);

    useEffect(() => {
        getPermissions().catch((error) => {
            addError({ key: 'users', message: httpErrorToHuman(error) });
            console.error(error);
        });
    }, []);

    if (!subusers.length && (loading || !Object.keys(permissions).length)) {
        return <Spinner size={'large'} centered />;
    }

    const UserContainer = styled1.div`
    
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
    return (
        <UserContainer>
        <ServerContentBlock title={'Users'}>
            <MainServerButton/>
            <h1 className="filetext mt-4" data-tw="hidden mt-4 md:flex select-none text-main font-bold">Users</h1>
            <div className="helpdiv">
            Create subusers and give them permissions to your server here. You can set specific permissions for each subuser to limit their actions. Please see our <a className="helplink">Subusers Guide </a>for more details.
            </div>
            <FlashMessageRender byKey={'users'} css={tw`mb-4`} />
            {!subusers.length ? (
                <p css={tw`text-center text-sm text-neutral-300 mt-4`}>It looks like you don&apos;t have any subusers.</p>
            ) : (
                subusers.map((subuser) => <UserRow key={subuser.uuid} subuser={subuser} />)
            )}
            <Can action={'user.create'}>
                <div css={tw`flex justify-end mt-6`}>
                    <AddSubuserButton />
                </div>
            </Can>
        </ServerContentBlock>
        </UserContainer>
    );
};
