import React from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

const ContainerBox = styled.div`
    .headings {
        margin-bottom: 1rem;
        font-weight: 700;
        font-size: 1.5rem;
        color: var(--ptx-text);
        line-height: 2rem;
    }
`;

type Props = Readonly<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
    }
>;


const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        <ContainerBox>
        {title && <h2 css={tw``} data-tw="mb-4 font-bold text-2xl" className="headings">{title}</h2>}
        </ContainerBox>
        {showFlashes && (
            <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} css={tw``} />
        )}
        <div css={[tw``, !!borderColor && tw``]}>
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </div>
    </div>
);

export default ContentBox;
