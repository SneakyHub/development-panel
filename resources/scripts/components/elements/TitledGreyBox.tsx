import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div css={tw`rounded border border-[color:var(--ptx-border)] shadow-md bg-[color:var(--ptx-secondary)]`} className={className}>
        <div css={tw`bg-[color:var(--ptx-primary)] rounded-t p-3 border-b border-[color:var(--ptx-border)]`}>
            {typeof title === 'string' ? (
                <p css={tw`text-sm uppercase font-bold text-[color:var(--ptx-text)]`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-sm font-bold text-[color:var(--ptx-text)]`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`p-3`}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
