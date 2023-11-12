import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean }>`
    ${(props) => props.isLight && tw``};
    color: var(--ptx-text);
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    font-style: normal;
`;

export default Label;
