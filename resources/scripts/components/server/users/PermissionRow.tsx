import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Checkbox from '@/components/elements/Checkbox';
import React from 'react';
import { useStoreState } from 'easy-peasy';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';


const UserPermActionCheckbox = styled.label`

    .divcss {
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
const Container = styled.label`
    ${tw`flex items-center border border-transparent rounded md:p-2 transition-colors duration-75`};
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0);
    background: var(--ptx-primary);
    border-radius: 0.25rem;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
    text-transform: capitalize;
    font-weight: 600;

    :hover {
        border-color: var(--ptx-border);
        background: var(--ptx-primary);
    }

    &:not(.disabled) {
        ${tw`cursor-pointer`};

        &:hover {
            ${tw`border-neutral-500 bg-neutral-800`};
        }
    }

    &:not(:first-of-type) {
        ${tw`mt-4 sm:mt-2`};
    }

    &.disabled {
        ${tw`opacity-50`};

        & input[type='checkbox']:not(:checked) {
            ${tw`border-0`};
        }
    }

    .outerdiv {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        border-width: 1px;
        border-color: rgba(0, 0, 0, 0);
        background: var(--ptx-primary);
        border-radius: 0.25rem;
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
        text-transform: none;

        :hover {
            border-color: var(--ptx-border);
        }
    }
`;


interface Props {
    permission: string;
    disabled: boolean;
}

const PermissionRow = ({ permission, disabled }: Props) => {
    const [key, pkey] = permission.split('.', 2);
    const permissions = useStoreState((state) => state.permissions.data);

    return (
        <Container htmlFor={`permission_${permission}`} className={disabled ? 'disabled' : undefined}>
            <div css={tw`p-2`}>
                <UserPermActionCheckbox>
                <Checkbox
                    id={`permission_${permission}`}
                    name={'permissions'}
                    value={permission}
                    css={tw`w-5 h-5 mr-2`}
                    disabled={disabled}
                    className="divcss"
                />
                </UserPermActionCheckbox>
            </div>
            <div css={tw`flex-1`}>
                <Label as={'p'} css={tw`font-bold`}>
                    {pkey}
                </Label>
                {permissions[key].keys[pkey].length > 0 && (
                    <p css={tw`text-xs text-neutral-400 mt-1`}>{permissions[key].keys[pkey]}</p>
                )}
            </div>
        </Container>
    );
};

export default PermissionRow;
