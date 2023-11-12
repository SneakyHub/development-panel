const colors = require('tailwindcss/colors');

const gray = {
    50: 'var(--color-1)',
    75: 'var(--color-1)',
    100: 'var(--color-2)',
    200: 'var(--color-3)',
    300: 'var(--color-4)',
    400: 'var(--color-5)',
    500: 'var(--color-6)',
    600: 'var(--color-7)',
    700: 'var(--color-8)',
    800: 'var(--color-9)',
    900: 'var(--color-10)',
};

const neutral = {
    50: 'var(--color-1)',
    100: 'var(--color-2)',
    200: 'var(--color-3)',
    300: 'var(--color-4)',
    400: 'var(--color-5)',
    500: 'var(--color-6)',
    600: 'var(--color-7)',
    700: 'var(--color-8)',
    800: 'var(--color-9)',
    900: 'var(--color-10)',
};

const themecss = {
    50: 'var(--ptx-primary)',
    100: 'var(--ptx-text)',
    200: 'var(--ptx-secondarytext)',
    300: 'var(--ptx-border)',
    400: 'var(--ptx-primary)',
    500: 'var(--scrollThumb)',
    600: 'var(--ptx-secondary)',
    700: 'var(--ptx-button)',
    800: 'var(--color-9)',
    900: 'var(--color-10)',
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif', 'Poppins'],
            },
            colors: {
                black: '#131a20',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: colors.blue,
                gray: gray,
                neutral: gray,
                cyan: colors.cyan,
                themecss: 'var(--ptx-button)',
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
