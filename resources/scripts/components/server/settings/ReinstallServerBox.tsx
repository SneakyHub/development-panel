import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import reinstallServer from '@/api/server/reinstallServer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import { Dialog } from '@/components/elements/dialog';
import styled1 from 'styled-components/macro';


export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [modalVisible, setModalVisible] = useState(false);
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const reinstall = () => {
        clearFlashes('settings');
        reinstallServer(uuid)
            .then(() => {
                addFlash({
                    key: 'settings',
                    type: 'success',
                    message: 'Your server has begun the reinstallation process.',
                });
            })
            .catch((error) => {
                console.error(error);

                addFlash({ key: 'settings', type: 'error', message: httpErrorToHuman(error) });
            })
            .then(() => setModalVisible(false));
    };
    const Reinstallbtn = styled1.div`
    display: inline-flex;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    justify-content: right;
    flex: 1 1 0%;
    width: 100%;

    @media (min-width: 640px) {
        flex: 0 0 auto;
        margin-top: 0px;
    }
    :hover {
    }
        .uploadbtn {
            background: linear-gradient(267.71deg, #ee5253 -37.36%, #ee5253 98.08%);
            display: inline-flex;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            align-items: center;
            justify-content: center;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            --tw-text-opacity: 1;
            color: rgba(255, 255, 255, var(--tw-text-opacity));
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 100ms;
            font-weight: 700;
            font-size: 13px;
            line-height: 18px;
            border-radius: 4px /* Sizing Controls */;
            flex: 1 1 0%;
            margin-right: 1rem;
            color: white;

            @media (min-width: 640px) {
                flex: 0 0 auto;
                margin-top: 0px;
            }
            :hover {

            }
        }
    }

`;

    useEffect(() => {
        clearFlashes();
    }, []);

    return (
        <TitledGreyBox title={'Reinstall Server'} css={tw`relative`}>
            <Dialog.Confirm
                open={modalVisible}
                title={'Confirm server reinstallation'}
                confirm={'Yes, reinstall server'}
                onClose={() => setModalVisible(false)}
                onConfirmed={reinstall}
            >
                Your server will be stopped and some files may be deleted or modified during this process, are you sure
                you wish to continue?
            </Dialog.Confirm>
            <p css={tw`text-sm text-[color:var(--ptx-text)]`}>
                Reinstalling your server will stop it, and then re-run the installation script that initially set it
                up.&nbsp;
                <strong css={tw`font-medium text-[color:var(--ptx-text)]`}>
                    Some files may be deleted or modified during this process, please back up your data before
                    continuing.
                </strong>
            </p>
            <Reinstallbtn>
            <div css={tw`mt-6 text-right`}>
                <Button.Danger variant={Button.Variants.Secondary} onClick={() => setModalVisible(true)} className="uploadbtn">
                    Reinstall Server
                </Button.Danger>
            </div>
            </Reinstallbtn>
        </TitledGreyBox>
    );
};
