import React, { memo, useCallback } from 'react';
import { useField } from 'formik';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';
import isEqual from 'react-fast-compare';
import styled from 'styled-components/macro';


export const UserActionCheckbox = styled(Input)`
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

interface Props {
    isEditable: boolean;
    title: string;
    permissions: string[];
    className?: string;
}

const PermissionTitleBox: React.FC<Props> = memo(({ isEditable, title, permissions, className, children }) => {
    const [{ value }, , { setValue }] = useField<string[]>('permissions');

    const onCheckboxClicked = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.currentTarget.checked) {
                setValue([...value, ...permissions.filter((p) => !value.includes(p))]);
            } else {
                setValue(value.filter((p) => !permissions.includes(p)));
            }
        },
        [permissions, value]
    );

    return (
        <TitledGreyBox
            title={
                <div css={tw`flex items-center`}>
                    <p css={tw`text-sm font-bold text-[color:var(--ptx-text)] uppercase flex-1`}>{title}</p>
                    {isEditable && (
                        <UserActionCheckbox
                            type={'checkbox'}
                            checked={permissions.every((p) => value.includes(p))}
                            onChange={onCheckboxClicked}
                        />
                    )}
                </div>
            }
            className={className}
        >
            {children}
        </TitledGreyBox>
    );
}, isEqual);

export default PermissionTitleBox;
