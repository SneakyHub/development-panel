    import React from 'react';
import tw from 'twin.macro';
import { ServerContext } from '@/state/server';
import styled from 'styled-components/macro';
import Input from '@/components/elements/Input';

export const FileActionCheckbox = styled(Input)`
    && {
        border: transparent;
        cursor: pointer;
        appearance: none;
        display: inline-block;
        vertical-align: middle;
        user-select: none;
        flex-shrink: 0;
        width: 1rem;
        height: 1rem;
        color: rgba(0, 0, 0, 0);
        border-radius: 0.125rem;
        background-color: var(--ptx-checkbox);
        background-origin: border-box;

        &:not(:checked) {
            outline: transparent solid 2px !important;
            outline-offset: 2px !important;
        }
        &:checked {
            background-repeat: no-repeat;
            background-position: center center;
            --tw-bg-opacity: 1;
            background-image: url(data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e);
            background-size: 100% 100%;
            background-color: rgba(59,130,246,var(--tw-bg-opacity)) !important;
        }
        &:focus {
            outline: transparent solid 2px !important;
            outline-offset: 2px !important;
        }
    }
`;

export default ({ name }: { name: string }) => {
    const isChecked = ServerContext.useStoreState((state) => state.files.selectedFiles.indexOf(name) >= 0);
    const appendSelectedFile = ServerContext.useStoreActions((actions) => actions.files.appendSelectedFile);
    const removeSelectedFile = ServerContext.useStoreActions((actions) => actions.files.removeSelectedFile);

    return (
        <label css={tw`flex-none px-4 py-2 absolute self-center z-30 cursor-pointer`}>
            <FileActionCheckbox
                name={'selectedFiles'}
                value={name}
                checked={isChecked}
                type={'checkbox'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.currentTarget.checked) {
                        appendSelectedFile(name);
                    } else {
                        removeSelectedFile(name);
                    }
                }}
            />
        </label>
    );
};
