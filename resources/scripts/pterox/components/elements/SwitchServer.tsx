import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { v4 } from 'uuid';
import tw from 'twin.macro';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';

const ToggleContainer = styled.div`
    position: absolute;
    top: 205px;
    

    & > input[type='checkbox'] {
        ${tw`hidden`};

        &:checked + label {
            background: linear-gradient(267.71deg,#EE00AB -37.36%,#A539CB 98.08%);
        }

        &:checked + label:before {
            right: 0.125rem;
            
        }
    }

    & > label {
        position: relative;
        display: inline-block;
        letter-spacing: 0.025em;
        font-weight: 700;
        border-radius: 4px;
        --tw-text-opacity: 1;
        color: rgba(255,255,255,var(--tw-text-opacity));
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
        background: linear-gradient(267.71deg, rgb(0, 124, 238) -37.36%, rgb(0, 124, 238) 98.08%);
        padding: 1rem 1.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        cursor: pointer;
        user-select: none !important;

        &::before {
            ${tw`absolute block bg-white border h-5 w-5 rounded-full`};
            top: 6px;
            right: calc(50% + 0.125rem);
            //width: 1.25rem;
            //height: 1.25rem;
            content: '';
            transition: all 75ms ease-in;
        }
    }
`;

export interface SwitchProps {
    name: string;
    label?: string;
    description?: string;
    defaultChecked?: boolean;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
}

const Switch = ({ name, label, description, defaultChecked, readOnly, onChange, children }: SwitchProps) => {
    const uuid = useMemo(() => v4(), []);

    return (
        <div css={tw``}>
            <ToggleContainer css={tw``}>
                {children || (
                    <Input
                        id={uuid}
                        name={name}
                        type={'checkbox'}
                        onChange={(e) => onChange && onChange(e)}
                        defaultChecked={defaultChecked}
                        disabled={readOnly}
                    />
                )}
                <Label htmlFor={uuid} />
            </ToggleContainer>
            {(label || description) && (
                <div css={tw`ml-4 w-full`}>
                    {label && (
                        <Label css={[tw`cursor-pointer`, !!description && tw`mb-0`]} htmlFor={uuid}>
                            {label}
                        </Label>
                    )}
                    {description && <p css={tw`text-neutral-400 text-sm mt-2`}>{description}</p>}
                </div>
            )}
        </div>
    );
};

export default Switch;
