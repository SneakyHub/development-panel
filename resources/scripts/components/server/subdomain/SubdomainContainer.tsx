import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { ServerContext } from '@/state/server';
import useFlash from '@/plugins/useFlash';
import getServerSubdomains from '@/api/server/subdomain/getServerSubdomains';
import Spinner from '@/components/elements/Spinner';
import tw from 'twin.macro';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { Field as FormikField, Form, Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import Button from '@/components/elements/Button';
import { object, string } from 'yup';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import Select from '@/components/elements/Select';
import Label from '@/components/elements/Label';
import createServerSubdomain from '@/api/server/subdomain/createServerSubdomain';
import FlashMessageRender from '@/components/FlashMessageRender';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import GreyRowBox from '@/components/elements/GreyRowBox';
import styled from 'styled-components/macro';
import DeleteSubdomainButton from '@/components/server/subdomain/DeleteSubdomainButton';
import MessageBox from '@/components/MessageBox';
import saveCloudflareDetails from '@/api/server/subdomain/saveCloudflareDetails';

const Code = styled.code`${tw`font-mono py-1 px-2 bg-neutral-900 rounded text-sm inline-block`}`;

export interface SubdomainResponse {
    subdomains: any[],
    domains: any[],
    ipAlias: string,
}

interface CreateValues {
    subdomain: string,
    domainId: number,
    protocol: string,
    protocolType: string,
}

interface SaveValues {
    cloudflareEmail: string,
    cloudflareApikey: string,
    domain: string,
}

export default () => {
    const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data, error, mutate } = useSWR<SubdomainResponse>([ uuid, '/subdomain' ], key => getServerSubdomains(key), {
        revalidateOnFocus: false,
    });

    const [ isOwnDomain, setOwnDomain ] = useState(false);
    const [ isSubmit, setSubmit ] = useState(false);
    const [ isSubmit2, setSubmit2 ] = useState(false);

    useEffect(() => {
        if (!error) {
            clearFlashes('server:subdomain');
        } else {
            clearAndAddHttpError({ key: 'server:subdomain', error });
        }
    }, [ error ]);

    useEffect(() => {
        if (data?.domains[0]) {
            setOwnDomain(data?.domains[0].id === 0);
        }
    }, [ data ]);

    const submit = ({ subdomain, domainId, protocol, protocolType }: CreateValues, { setSubmitting }: FormikHelpers<CreateValues>) => {
        clearFlashes('server:subdomain');
        setSubmitting(false);
        setSubmit(true);

        createServerSubdomain(uuid, subdomain, domainId, protocol, protocolType).then(() => {
            mutate();
            setSubmit(false);
        }).catch(error => {
            clearAndAddHttpError({ key: 'server:subdomain', error });
            setSubmitting(false);
            setSubmit(false);
        });
    };

    const submit2 = ({ cloudflareEmail, cloudflareApikey, domain }: SaveValues, { setSubmitting }: FormikHelpers<SaveValues>) => {
        clearFlashes('server:subdomain');
        setSubmitting(false);
        setSubmit2(true);

        saveCloudflareDetails(uuid, cloudflareEmail, cloudflareApikey, domain).then(() => {
            mutate();
            setSubmit2(false);
        }).catch(error => {
            clearAndAddHttpError({ key: 'server:subdomain', error });
            setSubmitting(false);
            setSubmit2(false);
        });
    };

    return (
        <ServerContentBlock title={'Subdomain'} css={tw`flex flex-wrap`}>
            <div css={tw`w-full`}>
                <FlashMessageRender byKey={'server:subdomain'} css={tw`mb-4`} />
            </div>
            {!data ?
                (
                    <div css={tw`w-full`}>
                        <Spinner size={'large'} centered />
                    </div>
                )
                :
                (
                    <>
                        {data.domains.length > 0 ? (
                            <>
                                <div css={tw`w-full lg:w-8/12 mt-4 lg:mt-0`}>
                                    <TitledGreyBox title={'Create Subdomain'}>
                                        <div css={tw`px-1 py-2`}>
                                            <Formik
                                                onSubmit={submit}
                                                initialValues={{ subdomain: '', domainId: data.domains[0].id, protocol: '', protocolType: 'tcp' }}
                                                validationSchema={object().shape({
                                                    subdomain: string().min(2).max(32).required(),
                                                })}
                                            >
                                                {({ handleChange, values }) => (
                                                    <Form>
                                                        <div css={tw`flex flex-wrap`}>
                                                            <div css={tw`mb-6 w-full lg:w-1/2`}>
                                                                <Field
                                                                    name={'subdomain'}
                                                                    label={'Subdomain'}
                                                                />
                                                            </div>
                                                            <div css={tw`mb-6 w-full lg:w-1/2 lg:pl-4`}>
                                                                <Label>Domain</Label>
                                                                <FormikFieldWrapper name={'domainId'}>
                                                                    <FormikField as={Select} name={'domainId'} onChange={(e: React.ChangeEvent<any>) => {
                                                                        handleChange(e);
                                                                        setOwnDomain(values.domainId.toString() !== '0');
                                                                    }}
                                                                    >
                                                                        {data.domains.map((item, key) => (
                                                                            <option key={key} value={item.id}>
                                                                                {item.domain}
                                                                            </option>
                                                                        ))}
                                                                    </FormikField>
                                                                </FormikFieldWrapper>
                                                            </div>
                                                            {isOwnDomain && (
                                                                <>
                                                                    <div css={tw`mb-6 w-full lg:w-1/2`}>
                                                                        <Field
                                                                            name={'protocol'}
                                                                            label={'Protocol'}
                                                                            placeholder={'For Example: _minecraft'}
                                                                        />
                                                                    </div>
                                                                    <div css={tw`mb-6 w-full lg:w-1/2 lg:pl-4`}>
                                                                        <Label>Protocol Type</Label>
                                                                        <FormikFieldWrapper name={'protocolType'}>
                                                                            <FormikField as={Select} name={'protocolType'}>
                                                                                <option value={'tcp'}>TCP</option>
                                                                                <option value={'udp'}>UDP</option>
                                                                                <option value={'tls'}>TLS</option>
                                                                            </FormikField>
                                                                        </FormikFieldWrapper>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div css={tw`flex justify-end`}>
                                                            <Button type={'submit'} disabled={isSubmit}>
                                                                Create
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                    </TitledGreyBox>

                                    {data.subdomains.length < 1 ?
                                        <p css={tw`text-center text-sm text-neutral-400 pt-4 pb-4`}>
                                            There are no subdomains for this server.
                                        </p>
                                        :
                                        (data.subdomains.map((item, key) => (
                                            <GreyRowBox $hoverable={false} css={tw`flex-wrap md:flex-nowrap mt-2`} key={key}>
                                                <div css={tw`flex items-center w-full md:w-auto`}>
                                                    <div css={tw`pl-4 pr-6 text-neutral-400`}>
                                                        <FontAwesomeIcon icon={faNetworkWired} />
                                                    </div>
                                                    <div css={tw`mr-4 flex-1 md:w-64`}>
                                                        <Code>{item.subdomain}.{item.domain}{item.record_type === 'CNAME' ? `:${item.port}` : ''}</Code>
                                                        <Label>Subdomain</Label>
                                                    </div>
                                                    <div css={tw`w-16 md:w-64 overflow-hidden`}>
                                                        <Code>{data.ipAlias}:{item.port}</Code>
                                                        <Label>Server Allocation</Label>
                                                    </div>
                                                </div>
                                                <div css={tw`w-full md:flex-none md:w-40 md:text-center mt-4 md:mt-0 text-right ml-4`}>
                                                    <DeleteSubdomainButton subdomainId={item.id} onDeleted={() => mutate()}></DeleteSubdomainButton>
                                                </div>
                                            </GreyRowBox>
                                        )))
                                    }
                                </div>
                            </>
                        ) : (
                            <>
                                <div css={tw`w-full lg:w-8/12 mt-4 lg:mt-0`}>
                                    <MessageBox type="info" title="Info">
                                        There are no available domain to current server.
                                    </MessageBox>
                                </div>
                            </>
                        )}
                        <div css={tw`w-full lg:w-4/12 lg:pl-4`}>
                            <TitledGreyBox title={'Subdomain Help'} css={tw`mb-4`}>
                                <div css={tw`px-1 py-2`}>
                                    You can create Subdomain for your server. For
                                    example: <code>myserver.example.com</code> or <code>myserver.example.com:25565</code>
                                </div>
                            </TitledGreyBox>
                            <TitledGreyBox title={'Add Own Domain'}>
                                <div css={tw`px-1 py-2`}>
                                    You can use your own domain to create subdomains. You need to simply insert <code>Cloudflare email</code> and <code>Cloudflare Global Api Key</code> and
                                    the <code>name of your domain</code>.
                                    <hr css={tw`mb-3 mt-3`} />
                                    <Formik
                                        onSubmit={submit2}
                                        initialValues={{ cloudflareEmail: '', cloudflareApikey: '', domain: '' }}
                                        validationSchema={object().shape({
                                            cloudflareEmail: string().min(5).max(100),
                                            cloudflareApikey: string().min(1).max(100),
                                            domain: string().min(3).max(100),
                                        })}
                                    >
                                        <Form>
                                            <div css={tw`flex flex-wrap`}>
                                                <div css={tw`mb-6 w-full`}>
                                                    <Field
                                                        name={'cloudflareEmail'}
                                                        label={'Cloudflare Email'}
                                                    />
                                                </div>
                                                <div css={tw`mb-6 w-full`}>
                                                    <Field
                                                        name={'cloudflareApikey'}
                                                        label={'Cloudflare Api Key'}
                                                    />
                                                </div>
                                                <div css={tw`mb-6 w-full`}>
                                                    <Field
                                                        name={'domain'}
                                                        label={'Domain'}
                                                    />
                                                </div>
                                            </div>
                                            <div css={tw`flex justify-end`}>
                                                <Button type={'submit'} disabled={isSubmit2}>
                                                    Save
                                                </Button>
                                            </div>
                                        </Form>
                                    </Formik>
                                </div>
                            </TitledGreyBox>
                        </div>
                    </>
                )
            }
        </ServerContentBlock>
    );
};
