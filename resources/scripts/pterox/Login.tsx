import * as React from 'react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';


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




    return (
        <img src={pteroxSettings["login"].value} alt="Logo"/>    
    );
};
