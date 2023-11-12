import React, { useEffect } from 'react';
import { httpErrorToHuman } from '@/api/http';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import FileObjectRow from '@/components/server/files/FileObjectRow';
import FileManagerBreadcrumbs from '@/components/server/files/FileManagerBreadcrumbs';
import { FileObject } from '@/api/server/files/loadDirectory';
import NewDirectoryButton from '@/components/server/files/NewDirectoryButton';
import { NavLink, useLocation } from 'react-router-dom';
import Can from '@/components/elements/Can';
import { ServerError } from '@/components/elements/ScreenBlock';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import { ServerContext } from '@/state/server';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import FileManagerStatus from '@/components/server/files/FileManagerStatus';
import MassActionsBar from '@/components/server/files/MassActionsBar';
import UploadButton from '@/components/server/files/UploadButton';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useStoreActions } from '@/state/hooks';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { FileActionCheckbox } from '@/components/server/files/SelectFileCheckbox';
import { hashToPath } from '@/helpers';
import style from './style.module.css';
import MainServerButton from '@/components/server/MainServerButton';
import styled1 from 'styled-components/macro';



const sortFiles = (files: FileObject[]): FileObject[] => {
    const sortedFiles: FileObject[] = files
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => (a.isFile === b.isFile ? 0 : a.isFile ? 1 : -1));
    return sortedFiles.filter((file, index) => index === 0 || file.name !== sortedFiles[index - 1].name);
};

export default () => {
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const { hash } = useLocation();
    const { data: files, error, mutate } = useFileManagerSwr();
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const clearFlashes = useStoreActions((actions) => actions.flashes.clearFlashes);
    const setDirectory = ServerContext.useStoreActions((actions) => actions.files.setDirectory);

    const setSelectedFiles = ServerContext.useStoreActions((actions) => actions.files.setSelectedFiles);
    const selectedFilesLength = ServerContext.useStoreState((state) => state.files.selectedFiles.length);

    useEffect(() => {
        clearFlashes('files');
        setSelectedFiles([]);
        setDirectory(hashToPath(hash));
    }, [hash]);

    useEffect(() => {
        mutate();
    }, [directory]);

    const onSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.currentTarget.checked ? files?.map((file) => file.name) || [] : []);
    };



    const FileContainer = styled1.div`
    
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

    .bread {
        min-width: 12rem;
        display: flex;
        -webkit-box-flex: 0;
        flex-grow: 0;
        -webkit-box-align: center;
        align-items: center;
        font-size: 0.75rem;
        line-height: 1rem;
        overflow-x: hidden;
        color: var(--ptx-secondarytext);


    }

    .createfilebtn {
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
        width: 100%;
        
        @media (min-width: 640px) {
            flex: 0 0 auto;
            margin-top: 0px;
        }
        :hover {
            background: var(--ptx-button);
        }

    }

    .createbtndiv {
        flex: 1 1 0%;

        @media (min-width: 640px) {
            flex: 0 0 auto;
            margin-top: 0px;
        }
    }

    .filebtns {
        min-width: 18rem;
        width: 100%;
        display: flex;
        flex-wrap: wrap-reverse;
        -webkit-box-pack: end;
        justify-content: flex-end;
        margin-bottom: 1rem;
        margin-left: 0px;

        @media (min-width: 640px) {
            flex-wrap: nowrap;
        }
        @media (min-width: 768px) {
            width: auto;
            margin-bottom: 0px;
            margin-left: auto;
        }
    
    }

`;


    if (error) {
        return <ServerError message={httpErrorToHuman(error)} onRetry={() => mutate()} />;
    }

    return (
        
        <ServerContentBlock title={'File Manager'} showFlashKey={'files'}>
            <FileContainer>
            <ErrorBoundary>
                <MainServerButton/>
                <h1 className="filetext mt-4" data-tw="hidden mt-4 md:flex select-none text-main font-bold">File Manager</h1>
                <div className="helpdiv">
                Manage your files directly from your web browser here. Downloading and uploading folders and files over 1GB is not supported through the file manager of the panel, please use <a className="helplink">SFTP</a>. For more details on how to connect with SFTP, see our <a className="helplink">SFTP Guide.</a>
                </div>
                <div className="flex flex-wrap-reverse justify-center xl:flex-nowrap mb-4 gap-2">
                    <div className="bread">
                    <FileManagerBreadcrumbs
                        renderLeft={
                            <FileActionCheckbox
                                type={'checkbox'}
                                css={tw`mx-4`}
                                checked={selectedFilesLength === (files?.length === 0 ? -1 : files?.length)}
                                onChange={onSelectAllClick}
                            />
                        }
                    />
                    </div>
                    <div className="filebtns">
                    <Can action={'file.create'}>
                            <FileManagerStatus />
                            <NewDirectoryButton />
                            <UploadButton />
                            <NavLink to={`/server/${id}/files/new${window.location.hash}`} className="createbtndiv">
                                <Button className="createfilebtn">Create File</Button>
                            </NavLink>
                        
                    </Can>
                    </div>
                </div>
            </ErrorBoundary>
            </FileContainer>
            {!files ? (
                <Spinner size={'large'} centered />
            ) : (
                <>
                    {!files.length ? (
                        <p css={tw`text-sm text-neutral-400 text-center`}>This directory seems to be empty.</p>
                    ) : (
                        <CSSTransition classNames={'fade'} timeout={150} appear in>
                            <div>
                                {files.length > 250 && (
                                    <div css={tw`rounded bg-yellow-400 mb-px p-3`}>
                                        <p css={tw`text-yellow-900 text-sm text-center`}>
                                            This directory is too large to display in the browser, limiting the output
                                            to the first 250 files.
                                        </p>
                                    </div>
                                )}
                                {sortFiles(files.slice(0, 250)).map((file) => (
                                    <FileObjectRow key={file.key} file={file} />
                                ))}
                                <MassActionsBar />
                            </div>
                        </CSSTransition>
                    )}
                </>
            )}
            
        </ServerContentBlock>
        
    );
};
