import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';


interface Values {
    username: string;
    password: string;
}

const Css = styled.div`
    color: var(--ptx-text);
    font-weight: 600;

    .login-button {
        position: relative;
        display: inline-block;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-letter-spacing: 0.025em;
        -moz-letter-spacing: 0.025em;
        -ms-letter-spacing: 0.025em;
        letter-spacing: 0.025em;
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        -webkit-transition-duration: 150ms;
        transition-duration: 150ms;
        font-weight: 700;
        font-size: 13px;
        line-height: 18px;
        border-radius: 4px;
        --tw-text-opacity: 1;
        color: rgba(255,255,255,var(--tw-text-opacity));
        -webkit-transition-property: all;
        transition-property: all;
        -webkit-transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        transition-timing-function: cubic-bezier(0.4,0,0.2,1);
        -webkit-transition-duration: 300ms;
        transition-duration: 300ms;
        background: var(--ptx-button);
        padding: 1rem;
        width: 100%;
        border-color: var(--ptx-border);
    }
`;
const Links = styled.div`
    color: var(--ptx-text);
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    font-style: normal;
`;


const CssContainer = styled.div`
    .outer {
        position: relative;
    }
    .outer #show{
        z-index: 20;
        position: absolute;
        font-weight: 600;
        cursor: pointer;
        right: 10px;
        top: 45px;
        height: auto;
        
    }

`;

const LoginContainer = ({ history }: RouteComponentProps) => {
    const [show,setShow]=useState(false);
    const handleShow=()=>{
        setShow(!show)
    }

    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik css={tw`text-red-500`}
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('A username or email must be provided.'),
                password: string().required('Please enter your account password.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <CssContainer>

                
                <LoginFormContainer title={'GB Panel Login'} css={tw`w-full flex font-bold text-3xl`}>
                    <Css>
                    <h6>
                    <Field light type={'text'} label={'Email'} name={'username'} disabled={isSubmitting} css={tw``} />
                    </h6>
                    </Css>
                    <Css>
                    
                    <div css={tw`mt-6`} className="outer" id="Pass">
                        <h6>
                        <Field light type={show?"text":"password"} label={'Password'} name={'password'} disabled={isSubmitting} css={tw``} className="password" />
                        </h6>
                        <label onClick={handleShow} id="show">{show?<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" css={tw`text-[color:var(--ptx-button)] hover:text-[color:var(--ptx-text)]`}>
                                                                        <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                                                                        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                                                                        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                                                                    </svg>
                                                                :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" css={tw`hover:text-[color:var(--ptx-button)]`}>
                                                                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                                                    </svg>
                                                              }</label>
                    </div>
                    </Css>
                    <Css>
                    <div css={tw`mt-6`} >
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting} css={tw``} className="login-button">
                            <b>Login</b>
                        </Button>
                    </div>
                    </Css>
                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size={'invisible'}
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}
                    <Links>
                    <div css={tw`mt-6 text-center text-sm`}>
                        <Link
                            to={'/auth/password'}
                            css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-white`}
                        >
                            <h6>Forgot password?</h6>
                        </Link>
                    </div>
                    </Links>
                </LoginFormContainer>
                </CssContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
