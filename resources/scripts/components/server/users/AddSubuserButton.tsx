import React, { useState } from 'react';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';
import { Button } from '@/components/elements/button/index';
import styled1 from 'styled-components/macro';


export default () => {
    const [visible, setVisible] = useState(false);

    const NewUserbtn = styled1.div`
    display: inline-flex;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    align-items: center;
    justify-content: center;
    flex: 1 1 0%;

    @media (min-width: 640px) {
        flex: 0 0 auto;
        margin-top: 0px;
    }
    :hover {
    }
        .uploadbtn {

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

            @media (min-width: 640px) {
                flex: 0 0 auto;
                margin-top: 0px;
            }
            :hover {

            }
        }
    }

`;

    return (
        <>
            <EditSubuserModal visible={visible} onModalDismissed={() => setVisible(false)} />
            <NewUserbtn>
            <Button onClick={() => setVisible(true)} className="uploadbtn">New User</Button>
            </NewUserbtn>
        </>
    );
};
