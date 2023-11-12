import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    body {
        transition:background .2s;
        ${tw`font-sans`};
        letter-spacing: 0.015em;
        color: var(--ptx-text);
        background-color: var(--ptx-primary);
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
    }

    p {
        ${tw`leading-snug font-sans`};
        color:var(--ptx-text);
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: var(--ptx-button);
        border-radius: 10px;
    }

    ::-webkit-scrollbar-track-piece {
        border: 2px solid var(--ptx-secondary);
        background-color: var(--ptx-secondary);
    }

    ::-webkit-scrollbar-thumb:horizontal {
        border-right-width: 0;
        border-left-width: 0;
        border-top-width: 4px;
        border-bottom-width: 4px;
        -webkit-border-radius: 4px 9px;
    }

    ::-webkit-scrollbar-thumb:hover {
        -webkit-box-shadow:
        inset 0 0 0 1px var(--ptx-primary),
        inset 0 0 0 4px var(--ptx-primary);
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
