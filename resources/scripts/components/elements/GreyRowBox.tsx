import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    height-min: 90px !important;
    display: flex;
    text-decoration: none;
    color: var(--ptx-text);
    -webkit-box-align: center;
    align-items: center;
    padding: 1rem;
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    background: var(--ptx-secondary);
    border: 1px solid rgba(141, 143, 172, 0.1);
    border-radius: 8px;

    ${(props) => props.$hoverable !== false && tw``};

    & .icon {
        ${tw`rounded-full w-16 flex items-center justify-center bg-neutral-500 p-3`};
    }
`;
