import React, { lazy } from 'react';
import ServerConsole from '@/components/server/console/ServerConsoleContainer';
import PopoutConsole from '@/components/server/console/PopoutConsoleContainer';
import DatabasesContainer from '@/components/server/databases/DatabasesContainer';
import ScheduleContainer from '@/components/server/schedules/ScheduleContainer';
import UsersContainer from '@/components/server/users/UsersContainer';
import BackupContainer from '@/components/server/backups/BackupContainer';
import NetworkContainer from '@/components/server/network/NetworkContainer';
import StartupContainer from '@/components/server/startup/StartupContainer';
import FileManagerContainer from '@/components/server/files/FileManagerContainer';
import SettingsContainer from '@/components/server/settings/SettingsContainer';
import AccountOverviewContainer from '@/components/dashboard/AccountOverviewContainer';
import AccountApiContainer from '@/components/dashboard/AccountApiContainer';
import AccountSSHContainer from '@/components/dashboard/ssh/AccountSSHContainer';
import ActivityLogContainer from '@/components/dashboard/activity/ActivityLogContainer';
import ServerActivityLogContainer from '@/components/server/ServerActivityLogContainer';
import SubdomainContainer from '@/components/server/subdomain/SubdomainContainer';
import { HiOutlineFolderOpen, HiOutlineEye, HiOutlineUserGroup, HiOutlineCog,HiOutlineDatabase, HiOutlineTerminal, HiOutlineArchive,HiOutlinePlay, HiOutlineCalendar, HiOutlineGlobe } from "react-icons/hi";
// Each of the router files is already code split out appropriately — so
// all of the items above will only be loaded in when that router is loaded.
//
// These specific lazy loaded routes are to avoid loading in heavy screens
// for the server dashboard when they're only needed for specific instances.
const FileEditContainer = lazy(() => import('@/components/server/files/FileEditContainer'));
const ScheduleEditContainer = lazy(() => import('@/components/server/schedules/ScheduleEditContainer'));

interface RouteDefinition {
    path: string;
    // If undefined is passed this route is still rendered into the router itself
    // but no navigation link is displayed in the sub-navigation menu.
    name: string | undefined;
    component: React.ComponentType;
    exact?: boolean;
    pteroxicon?: React.ComponentType;
}

interface ServerRouteDefinition extends RouteDefinition {
    permission: string | string[] | null;

    //egg and nest ids
    nestId?: number;
    eggId?: number;
    nestIds?: number[];
    eggIds?: number[];

}

interface Routes {
    // All of the routes available under "/account"
    account: RouteDefinition[];
    // All of the routes available under "/server/:id"
    server: ServerRouteDefinition[];
}

export default {
    account: [
        {
            path: '/',
            name: '',
            component: AccountOverviewContainer,
            exact: true,
        },
        {
            path: '/api',
            name: null,
            component: AccountApiContainer,
        },
        {
            path: '/ssh',
            name: null,
            component: AccountSSHContainer,
        },
        {
            path: '/activity',
            name: null,
            component: ActivityLogContainer,
        },
    ],
    server: [
        {
            pteroxicon: HiOutlineTerminal,
            path: '/',
            permission: null,
            name: 'Console',
            component: ServerConsole,
            exact: true,
        },
        {
            path: '/console',
            permission: null,
            name: null,
            component: PopoutConsole,
            exact: true,
        },
        {
            pteroxicon: HiOutlineFolderOpen,
            path: '/files',
            permission: 'file.*',
            name: 'Files',
            component: FileManagerContainer,
        },
        {
            path: '/files/:action(edit|new)',
            permission: 'file.*',
            name: undefined,
            component: FileEditContainer,
        },
        {
            pteroxicon: HiOutlineDatabase,
            path: '/databases',
            permission: 'database.*',
            name: 'Databases',
            component: DatabasesContainer,
        },
        {
            pteroxicon: HiOutlineCalendar,
            path: '/schedules',
            permission: 'schedule.*',
            name: 'Schedules',
            component: ScheduleContainer,
        },
        {
            path: '/schedules/:id',
            permission: 'schedule.*',
            name: undefined,
            component: ScheduleEditContainer,
        },
        {
            pteroxicon: HiOutlineUserGroup,
            path: '/users',
            permission: 'user.*',
            name: 'Subusers',
            component: UsersContainer,
        },
        {
            pteroxicon:  HiOutlineArchive,
            path: '/backups',
            permission: 'backup.*',
            name: 'Backups',
            component: BackupContainer,
        },
        {
            pteroxicon: HiOutlineGlobe,
            path: '/network',
            permission: 'allocation.*',
            name: 'Network',
            component: NetworkContainer,
        },
        {
            pteroxicon: HiOutlinePlay,
            path: '/startup',
            permission: 'startup.*',
            name: 'Startup',
            component: StartupContainer,
        },
        {
            pteroxicon: HiOutlineCog,
            path: '/settings',
            permission: ['settings.*', 'file.sftp'],
            name: 'Settings',
            component: SettingsContainer,
        },
        {
            pteroxicon: HiOutlineEye,
            path: '/activity',
            permission: 'activity.*',
            name: 'Logs',
            component: ServerActivityLogContainer,
        },
        {
            pteroxicon: HiOutlineCog,
            path: '/subdomain',
            permission: 'subdomain.*',
            name: 'Domain',
            component: SubdomainContainer,
        },
    ],
} as Routes;
