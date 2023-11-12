import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import tw from 'twin.macro';

const ContentContainer = styled.div`
    margin-top: 45px;
    margin-bottom: 45px;
    margin-left: 0 !important;
    -webkit-transition: all .3s;
    transition: all .3s;
    padding-top: 90px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    -webkit-transition: all .3s;
    transition: all .3s;
    @media screen and (min-width: 60em) {
        margin-left: 280px;
        padding-left: 47.5px;
        padding-right: 47.5px;
    }
`;
ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
