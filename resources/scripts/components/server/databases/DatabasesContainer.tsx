import React, { useEffect, useState } from 'react';
import getServerDatabases from '@/api/server/databases/getServerDatabases';
import { ServerContext } from '@/state/server';
import { httpErrorToHuman } from '@/api/http';
import FlashMessageRender from '@/components/FlashMessageRender';
import DatabaseRow from '@/components/server/databases/DatabaseRow';
import Spinner from '@/components/elements/Spinner';
import CreateDatabaseButton from '@/components/server/databases/CreateDatabaseButton';
import Can from '@/components/elements/Can';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import Fade from '@/components/elements/Fade';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import MainServerButton from '@/components/server/MainServerButton';
import styled1 from 'styled-components/macro';
import { NavLink } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';

export default () => {

    const pteroxSettingsJSON = useStoreState((state: ApplicationStore) => state.settings.data!.pterox_settings);
    const pteroxSettings: { [name: string]: any } = {};
    try {
        const settings: any[] = JSON.parse(pteroxSettingsJSON);
    
        for (const element of settings) {
            pteroxSettings[element.name] = element;
        }
    } catch (error) {
        console.error('Error parsing pteroxSettingsJSON:', error);
    }



    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const databaseLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.databases);

    const { addError, clearFlashes } = useFlash();
    const [loading, setLoading] = useState(true);

    const databases = useDeepMemoize(ServerContext.useStoreState((state) => state.databases.data));
    const setDatabases = ServerContext.useStoreActions((state) => state.databases.setDatabases);

    useEffect(() => {
        setLoading(!databases.length);
        clearFlashes('databases');

        getServerDatabases(uuid)
            .then((databases) => setDatabases(databases))
            .catch((error) => {
                console.error(error);
                addError({ key: 'databases', message: httpErrorToHuman(error) });
            })
            .then(() => setLoading(false));
    }, []);

    const DatabaseContainer = styled1.div`
    
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
const ManageDB = styled1.div`
    .db {
        border-radius: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.025em;
        font-size: 0.875rem;
        line-height: 1.25rem;
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        font-weight: 700;
        background-color: var(--ptx-button);
        border-color: var(--ptx-button);
        border-width: 1px;
        --tw-text-opacity: 1;
        color: rgba(239,246,255,var(--tw-text-opacity));
        padding: 0.5rem 1rem;
        height: 38.19px !important;
        margin-right: 5px;
        display: flex;
    }
}
`;
    return (
        <DatabaseContainer>
        <ServerContentBlock title={'Databases'}>
            <MainServerButton/>
            <h1 className="filetext mt-4" data-tw="hidden mt-4 md:flex select-none text-main font-bold">Databases</h1>
            <div className="helpdiv">
            Manage databases for your server and plugins here. You are allowed 3 databases by default. Database storage does not count towards your server's storage allocation. Please see our fair use policy for more details and our<a className="helplink">Database Guide</a> for help. 
            </div>
            <FlashMessageRender byKey={'databases'} css={tw`mb-4 mt-4`} />
            {!databases.length && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <Fade timeout={150}>
                    <>
                        {databases.length > 0 ? (
                            databases.map((database, index) => (
                                <DatabaseRow
                                    key={database.id}
                                    database={database}
                                    className={index > 0 ? 'mt-1' : undefined}
                                />
                            ))
                        ) : (
                            <p css={tw`text-center text-sm text-neutral-300 mt-4`}>
                                {databaseLimit > 0
                                    ? 'It looks like you have no databases.'
                                    : 'Databases cannot be created for this server.'}
                            </p>
                        )}
                        <Can action={'database.create'}>
                            <div css={tw`mt-6 flex items-center justify-end`}>
                                {databaseLimit > 0 && databases.length > 0 && (
                                    <p css={tw`text-sm text-neutral-300 mt-4 mb-4 sm:mr-6 sm:mb-0`}>
                                        {databases.length} of {databaseLimit} databases have been allocated to this
                                        server.
                                    </p>
                                )}

                                {pteroxSettings["phpmyadmin"].value === '' ?
                                <>

                                </>
                                :
                                <>
                                    <ManageDB>
                                        <NavLink target="_blank" to={pteroxSettings["phpmyadmin"].value} className="db">Manage Database</NavLink>
                                    </ManageDB>
                                </>
                                }

                                {databaseLimit > 0 && databaseLimit !== databases.length && (
                                    <CreateDatabaseButton css={tw`flex justify-end mt-6`} />
                                )}
                        
                            </div>
                        </Can>
                    </>
                </Fade>
            )}
        </ServerContentBlock>
        </DatabaseContainer>
    );
};
