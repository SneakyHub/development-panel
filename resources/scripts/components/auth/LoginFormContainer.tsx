import React, { forwardRef, useState } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import DarkLightMode from '@/pterox/components/elements/ColorMode';
import { Link } from 'react-router-dom';
import Logo from '@/pterox/Logo';
import Login from '@/pterox/Login';


type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    margin-left: auto;
    margin-right: auto;
    max-width: 1280px;
    padding-top: 5rem;

    .colormode {
        cursor: pointer;
        position: fixed;
        z-index:9999;
        top: 15px;
        padding: 10px;
        border-radius: 3px;
        right: 15px;
    }
    .div1 {
        display: grid;
        grid-template-columns: repeat(1, minmax(0px, 1fr));
        -webkit-box-align: center;
        place-items: center stretch;
        gap: 1.5rem;

        @media (min-width: 1280px) {
            grid-template-columns: repeat(2, minmax(0px, 1fr));
            padding: 1.5rem;
        }
    }

    .div2 {
        border-radius: 0.25rem;
        --tw-bg-opacity: 1;
        background-color: var(--ptx-secondary);
        padding: 2rem;
        --tw-shadow: 0px 3px 6px rgba(0,0,0,0.29);
        --tw-shadow-colored: 0px 3px 6px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);
    }

    .div3 {
        visibility: hidden;
        width: 0px;
        justify-content: center;
        display: flex;

        padding: 3rem;
        @media (min-width: 1280px) {
            visibility: visible;
            width: auto;
        }
    }

    .headingdiv {
        padding-left: 0.5rem;
        padding-bottom: 1.5rem;
        font-weight: 600;
        --tw-text-opacity: 1;
        color: var(--ptx-text);
        font-size: 1.875rem;
        line-height: 2.25rem;
        @media (min-width: 1024px) {
            font-size: 3rem;
            line-height: 1;
            padding-left: 1.5rem;
        }
    }

    .imageside {
        max-width: 100%;
        height: auto;

        @media (min-width: 1280px) {
            padding: 1.5rem;
        }
    }
`;
const Background = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: 83.3333%;
    margin-top: 3rem;

    .heading {
        font-size: 1.875rem;
        line-height: 2.25rem;
        text-align: center;
        color: var(--ptx-text);
        font-weight: 600;
        padding: 1rem;
        justify-content: center;
        display: flex;
    }
    .hr {
        border-color: rgb( 140, 142, 171);
        opacity: 0.2;
    }
    .form {
        width: 100%;
        margin: 0px;
    }

    .logo {
        display: flex;
        position: fixed;
        left: 20px;
        top: 10px;
        width: 400px;

        @media (max-width: 1200px) {
            width: 300px;
        }
    }
    .trademark {
        margin-bottom: 0px;
        align-items: center;
        justify-content: center;

    }

    .formdiv {
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        display: flex;
        width: 100%;
        flex-direction: column;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        @media (min-width: 1024px) {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
    }
`;
const Header = styled.div`
    display: flex;
    height: 5rem;
    width: 100%;
    z-index: 1000;
    position: absolute;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    --tw-bg-opacity: 1;
    background-color: var(--ptx-secondary);
    font-size: 1.125rem;
    line-height: 1.75rem;
    border-bottom: 1px solid var(--ptx-border);
    box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);
    margin-top: -3rem;
    .imgdiv {
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        @media (min-width: 1280px){
            margin-left: 1.5rem;
            margin-right: 1.5rem;
            width: auto;
        }
    }
    .imglogo {
        margin-left: auto;
        margin-right: auto;
        height: 4rem;

        @media (min-width: 1280px) {
            margin-left: 1.5rem;
            margin-right: 1.5rem;
        }
    }

    .billing {
        visibility: hidden;
        width: 0px;

        @media (min-width: 1280px) {
            visibility: visible;
            margin-left: auto;
            width: auto;
        }
    }

    .know {
        visibility: hidden;
        width: 0px;

        @media (min-width: 1280px) {
            visibility: visible;
            margin-left: 1.5rem;
            width: auto;
        }
    }

    .discord {
            visibility: visible;
            margin-left: 1.5rem;
            margin-right: 1.5rem;
            width: auto;
            justify-content: right;
            display: flex;
            width: 100%;
        
    }

`;


export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (

    <div>
        <Header>
                    <Link
                        to={'/'}
                        className={
                            'logolink active max-w-[200px] p-6'
                        }
                        data-tw="flex items-center flex-row"
                    >
                        <Logo/>
                    </Link>
                    <a className="discord">
                    <DarkLightMode />
                    </a>
        </Header>
    <Background>
    <Container>
    <div className="div1">
        <div className="div2">
            <div className="headingdiv">Welcome Back !!</div>
            <hr className="hr"/>
        <FlashMessageRender css={tw`mb-2 px-1`} />
        <Form {...props} ref={ref} className="form">
            <div css={tw` w-full p-6 mx-1`} className="formdiv">
                
                <div css={tw`flex-1`}>{props.children}</div>
            </div>
        </Form>
	<div className="flex items-center border-l-8 text-white rounded-md shadow px-4 py-3 border-red-500 bg-red-500/25 mt-3">
	<svg width="1.5rem" height="1.5rem" viewBox="-2 -2 24 24" className="fill-red-400 mr-2 jam jam-alert" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin"><path d='M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-13a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'/></svg>
		Your panel password is different to your billing password!
	</div>
        </div>
        <div className="div3">
            <Login/>
        </div>
        
    </div>
    </Container>
    <h6 className="trademark">
            <p css={tw`text-center text-neutral-500 text-xs mt-4`}>
                &copy;2019 - {new Date().getFullYear()}&nbsp;
                <a
                rel={'noopener nofollow noreferrer'}
                href={'https://pterodactyl.io/'}
                target={'_blank'}
                css={tw`no-underline text-neutral-500 hover:text-white`}
                >
                Pterodactyl
                </a>
            </p>
            <p css={tw`text-center text-neutral-500 text-xs mt-4`}>
                Theme By WebPool Technologies
            </p>
        </h6>
    </Background>
    </div>
));
