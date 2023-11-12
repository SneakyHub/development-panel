import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStoreState, State } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import ColorMode from '@/pterox/components/elements/ColorMode';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styled1 from 'styled-components/macro';
import { styled } from '@mui/material/styles';
import Md5 from 'md5';
import Cookies from 'js-cookie';
import { IconContext } from "react-icons";
import { HiMenuAlt1, HiMenu } from "react-icons/hi";


const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--ptx-primary)',
    color: 'var(--ptx-text)',
    boxShadow: theme.shadows[1],
    fontSize: 15,
    fontWeight: 100,
  },
}));

const SideBar = styled1.div`
    overflow: hidden;
    z-index: 100;

    .sidebarclose {
        width: 104px;

        color: var(--ptx-secondary);
    }

    .display {
        transition: width 0.6s ease-in-out;
    }

    .minisidebar {
        display: flex;
        @media (max-width: 1119px) {
            display: none;
        }
    }
}
`;



const MenuBar2 = styled1.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 32px;
    position: fixed;
    height: calc(100% - 90px);
    top: 90px;
    z-index: 100;
    background: var(--ptx-secondary);
    width: 280px;
    left: 0px;
    white-space: nowrap;
    overflow-x: hidden;
    
    transition: all .3s cubic-bezier(.77,0,.175,1);

    .topdiv {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 8px;
        width: 218px;
        height: 576px;
        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
    }

    .minisidebar {
        display: flex;
        @media (min-width: 60em) {
            display: none;
        }
    }

    .bottomdiv {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 8px;

        width: 218px;
        height: 120px;
        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }

    .profile {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;
        gap: 12px;
        width: 218px;
        height: 56px;
        flex: none;
        order: 0;
        flex-grow: 0;        
    }
    
    .search {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 16px;
        gap: 10px;
        width: 218px;
        height: 56px;
        border-radius: 16px;
        flex: none;
        order: 1;
        flex-grow: 0;
    }

    .buttonslist {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px;
        gap: 8px;
        width: 218px;
        height: 376px;
        flex: none;
        order: 2;
        flex-grow: 0;        
        padding-top: 30px;
    }

    .buttondiv {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
        gap: 10px;
        width: 218px;
        height: 56px;
        border-radius: 8px;
        flex: none;
        order: 0;
        flex-grow: 0;   
        transition: 0.2s;     
        fill: var(--ptx-text);
        :hover {
            padding-left: 25px;
            transition: 0.2s;
            color: var(--ptx-button);
            fill: var(--ptx-button);
        }

        
    }
    .buttondiv.active {
        padding-left: 25px;
        transition: 0.2s;
        color: var(--ptx-button);
        fill: var(--ptx-button);
    }

    .spandiv {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px;
        gap: 16px;
        
        width: 186px;
        height: 24px;
        flex: none;
        order: 0;
        flex-grow: 0;        
    }

    .spanicon {
        width: 24px;
        height: 24px;
        flex: none;
        order: 0;
        flex-grow: 0;
        :hover {
            color: var(--ptx-button);
        }
    }
    .spantext {
        width: 83px;
        height: 22px;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        flex: none;
        order: 1;
        flex-grow: 0;

    }
    .pic {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        flex: none;
        order: 0;
        flex-grow: 0;
    }
    .emaildiv {
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 0px;
        width: 150px;
        height: 41px;
        flex: none;
        order: 1;
        flex-grow: 0;        
    }
    .namespan {
        width: 150px;
        height: 22px;
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 22px;
        flex: none;
        order: 0;
        flex-grow: 0;
    }
    .emailspan {
        width: 150px;
        height: 19px;

        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 19px;
        flex: none;
        order: 1;
        flex-grow: 0;
    }
`;
const Navigation = styled1.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    height: 90px;
    background: var(--ptx-secondary);
    border-bottom: 1px solid rgba(141,143,172,.25);
    z-index: 100;

    .LogoDiv {
        margin-right: 26px;
        cursor: pointer;
        color: var(--ptx-text);
    }

    .LogoDiv:hover {
        color: var(--ptx-button);
    }
    
    .topbar {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        gap: 1rem;
    }
    .logolink {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        min-width: 200px;
    }
    .searchicon {
        position: relative;
        cursor: pointer;
        font-weight: 600;
    }
    .searchicon:hover {
        color: var(--ptx-button);
    }

    .searchicon2 {
        cursor: pointer;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }

    .emailLog {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        gap: 1.5rem;

    }
    .email {
        display: none;
    }

    @media (min-width: 768px)
    .email {
        display: block;
    }

    .UserName {
        color: var(--ptx-text);
        line-height: 30px;
        font-size: 16px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-weight: 600;
    }
    .logouticon {
        position: relative;
        cursor: pointer;
        font-weight: 600;
        color: var(--ptx-text);
    }
    .logouticon:hover {
        color: red;
    }

}
`;

const Logo = styled1.div`
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    .Logobox {
        width: auto;
        margin-left: 25px;
        border-color: rgba(141, 143, 172, 0.25);

        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: start;
        -webkit-justify-content: flex-start;
        -ms-flex-pack: start;
        justify-content: flex-start;
        border-style: none;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    
    }
    @media (min-width: 768px)
    .Logobox {
        border-right-width: 1px;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
    }
    .MenuBar {
        margin-right: 26px;
        cursor: pointer;
        color: var(--ptx-text);
    }
    .MenuBar:hover {
        color: var(--ptx-button);
    }
}   
    
`;
const RightNavigation = styled1.div`
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    gap: 1rem;

    
}
`;

export default () => {
    const pteroxSettingsJSON = useStoreState((state: ApplicationStore) => state.settings.data!.pterox_settings);
    const pteroxSettings: { [name: string]: any } = {};
    try {
        const settings: any[] = JSON.parse(pteroxSettingsJSON);
    
        for (const element of settings) {
            pteroxSettings[element.name] = element;
        }
    } catch (error) {
        console.error('Error parsing pteroxSettingsJSON:', error);
    }



    const name = useStoreState(state => state.user.data?.username);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const useremail = useStoreState(state => state.user.data?.email);
    const user_email = String(useremail);
    const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    // Menubar
    const [ sidebar, setSidebar ] = useState(false);
    useEffect(() => {
        if (Cookies.get("modesidebar") == 'sidebar'){
            document.body.classList.add('sidebar');
            document.body.classList.remove('nosidebar');
            setSidebar(true);
        } else {
            document.body.classList.remove('sidebar');
            document.body.classList.add('nosidebar');
            setSidebar(false);
        };
        },);
    
    const showSidebar = () => {
            if (Cookies.get("modesidebar") == 'sidebar'){
                Cookies.set("modesidebar", "nosidebar", {
                    expires: 365,
                    secure: true,
                    sameSite: 'strict',
                });
                document.body.classList.remove('sidebar');
                document.body.classList.add('nosidebar');
                setSidebar(false);
            } else {
                Cookies.set("modesidebar", "sidebar", {
                    expires: 365,
                    secure: true,
                    sameSite: 'strict',
                });
                document.body.classList.add('sidebar');
                document.body.classList.remove('nosidebar');
                setSidebar(true);
            }
    };



    const Gravatar = Md5(user_email);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };



    return (
        <>
        <Navigation>
            <SpinnerOverlay visible={isLoggingOut} />
            <Logo data-tw='flex w-full items-center'>
                <div className="Logobox" data-tw="flex justify-start border-none md:border-r md:justify-center items-center" >
                    <div data-tw="cursor-pointer" className="MenuBar" onClick={showSidebar}>
                        <div css={ sidebar ? tw`hidden` : tw`flex`}>
                            <IconContext.Provider value={{ color: "var(--ptx-text)", className: "h-7 w-7" }}>
                                <div>
                                    <HiMenu/>
                                </div>
                            </IconContext.Provider>
                        </div>
                        
                        <div css={ sidebar ? tw`flex` : tw`hidden`}>
                            <IconContext.Provider value={{ color: "var(--ptx-text)", className: "h-7 w-7" }}>
                                <div>
                                    <HiMenuAlt1/>
                                </div>
                            </IconContext.Provider>
                        </div>
                    </div>
                    <Link
                        to={'/'}
                        className={
                            'logolink active max-w-[200px] p-6'
                        }
                        data-tw="flex items-center flex-row"
                    >
                        <img src={pteroxSettings["logo"].value} alt="Logo"/>
                    </Link>
                </div>
            </Logo>
            <RightNavigation data-tw="flex items-center px-4 gap-4 lg:(gap-8 px-6)">
                <div data-tw="flex items-center gap-4" className="topbar">
                    <span data-text="Search" className="searchicon">
                        <div data-tw="cursor-pointer flex" className="searchicon2"> 
                            <SearchContainer />
                        </div>
                    </span>
                    <span data-text="Light mode" className="searchicon">
                        <div data-tw="cursor-pointer flex" className="searchicon2">
                            <ColorMode />
                        </div>
                    </span>
                </div>
            </RightNavigation>
        </Navigation>
        

        <SideBar>
            <div className={ sidebar ? `` : `minisidebar`}>
            <MenuBar2 css={ sidebar ? tw`w-72 p-6` : tw`w-[104px] p-6`} className=" sideBar h-screen flex flex-col items-stretch fixed w-full md:w-64 nav-primary z-40">
                <div className="topdiv">
                    <div className="profile">  
                        <LightTooltip title="Your Account">
                                <a href="/account" >
                                    <div>
                                        <img src={'https://www.gravatar.com/avatar/' + Gravatar+`?d=${pteroxSettings["avatar"].value}` } className='pic' />
                                    </div>
                                </a>
                        </LightTooltip>
                        <div className="emaildiv" css={ sidebar ? tw`flex` : tw`hidden`}>
                            <span className="namespan">
                                {name}
                            </span>
                            <span className="emailspan">
                                {user_email}
                            </span>
                        </div>
                    </div>
                    <div className="buttonslist">
                    <NavLink exact className="buttondiv"  activeClassName="active" to='/'>
                            <span className="spandiv">
                                <span className="spanicon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="" height="28px" width="28px">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                                </svg>
                                </span>
                                <span className="spantext" css={ sidebar ? tw`flex` : tw`hidden`}>
                                    My Servers
                                </span>
                            </span>
                    </NavLink>
                    {pteroxSettings["knowledge"].value === '' ?
                    <>
                    
                    </>
                    :
                    <>
                        <NavLink target="_blank" className="buttondiv"  activeClassName="active" to={{pathname: pteroxSettings["knowledge"].value}}  rel="noreferrer noopener">
                                <span className="spandiv">
                                    <span className="spanicon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="" height="28px" width="28px">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                                    </svg>
                                    </span>
                                    <span className="spantext" css={ sidebar ? tw`flex` : tw`hidden`}>
                                        Knowledge Base
                                    </span>
                                </span>
                        </NavLink>
                    </>
                    }
                    {pteroxSettings["discord"].value === '' ?
                    <>
                    
                    </>
                    :
                    <>
                        <NavLink target="_blank" className="buttondiv"  activeClassName="active" to={{pathname: pteroxSettings["discord"].value}}  rel="noreferrer noopener">
                                <span className="spandiv">
                                    <span className="spanicon">
                                    <svg width="28px" height="28px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.942 5.556a16.299 16.299 0 0 0-4.126-1.297c-.178.321-.385.754-.529 1.097a15.175 15.175 0 0 0-4.573 0 11.583 11.583 0 0 0-.535-1.097 16.274 16.274 0 0 0-4.129 1.3c-2.611 3.946-3.319 7.794-2.965 11.587a16.494 16.494 0 0 0 5.061 2.593 12.65 12.65 0 0 0 1.084-1.785 10.689 10.689 0 0 1-1.707-.831c.143-.106.283-.217.418-.331 3.291 1.539 6.866 1.539 10.118 0 .137.114.277.225.418.331-.541.326-1.114.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595c.415-4.396-.709-8.209-2.973-11.589zM8.678 14.813c-.988 0-1.798-.922-1.798-2.045s.793-2.047 1.798-2.047 1.815.922 1.798 2.047c.001 1.123-.793 2.045-1.798 2.045zm6.644 0c-.988 0-1.798-.922-1.798-2.045s.793-2.047 1.798-2.047 1.815.922 1.798 2.047c0 1.123-.793 2.045-1.798 2.045z"/>
                                    </svg>
                                    </span>
                                    <span className="spantext" css={ sidebar ? tw`flex` : tw`hidden`}>
                                        Discord
                                    </span>
                                </span>
                        </NavLink>
                    </>
                    }
                    {pteroxSettings["billing"].value === '' ?
                    <>
                    
                    </>
                    :
                    <>
                        <NavLink target="_blank" className="buttondiv"  activeClassName="active" to={{pathname: pteroxSettings["billing"].value}}  rel="noreferrer noopener">
                                <span className="spandiv">
                                    <span className="spanicon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="" height="28px" width="28px">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    </span>
                                    <span className="spantext" css={ sidebar ? tw`flex` : tw`hidden`}>
                                        Billing
                                    </span>
                                </span>
                        </NavLink>
                    </>
                    }
                    <NavLink className="buttondiv"  activeClassName="active" to='/account'>
                            <span className="spandiv">
                                <span className="spanicon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="" height="28px" width="28px">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                </span>
                                <span className="spantext" css={ sidebar ? tw`flex` : tw`hidden`}>
                                    My Account
                                </span>
                            </span>
                    </NavLink>
                    </div>
            
                </div>
                <div className="bottomdiv">
                {rootAdmin &&
                    <NavLink className="buttondiv"  activeClassName="admin" to='/admin' target="_blank">
                            <span className="spandiv">
                                <span className="spanicon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="" height="28px" width="28px">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                </span>
                                <span className="spantext" css={ sidebar ? tw`flex` : tw`hidden`}>
                                    Admin Panel
                                </span>
                            </span>
                        </NavLink>
                        }
                        <NavLink className="buttondiv hover:text-red-500" onClick={onTriggerLogout} to='/auth/logout' >
                            <span className="spandiv">
                                <span className="spanicon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="" width="28px" height="28px" onClick={onTriggerLogout}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                                </span>
                                <span className="spantext" css={ sidebar ? tw`flex` : tw`hidden`}>
                                    Logout
                                </span>
                            </span>
                    </NavLink>
                </div>
            </MenuBar2>
            </div>
        </SideBar>

        

        </>
    );
};
