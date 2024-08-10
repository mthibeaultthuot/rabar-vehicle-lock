import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { createTextLabel } from './index.js';


const API_NAME = 'vehicle-lock-api';
const Rebar = useRebar();





export function useApi() {
    function  setupLockOnVehicleSpawn(player: alt.Player, vehicle : alt.Vehicle) {
        createTextLabel(player, vehicle);
    }

    return {
        setupLockOnVehicleSpawn,
    };
}

declare global {
    export interface ServerPlugin {
        [API_NAME]: ReturnType<typeof useApi>;
    }
}

Rebar.useApi().register(API_NAME, useApi());


