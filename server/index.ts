import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import "./api.js";

const Rebar = useRebar();

let vehicleLocks : VehicleLock[] = [];


function getAllOwnedVehiclesByPlayer(player: alt.Player) {
    const rPlayer = Rebar.usePlayer(player);
    const playerId = rPlayer.account.getField('_id');


    const vehicles = alt.Vehicle.all
        .filter(vehicle => Rebar.document.vehicle.useVehicle(vehicle).getField('owner') == playerId)
        
    return vehicles;
}

function isOwner(player : alt.Player, vehicle: alt.Vehicle): boolean {
    const rPlayer = Rebar.usePlayer(player);
    const playerId = rPlayer.account.getField('_id');   
    return Rebar.document.vehicle.useVehicle(vehicle).getField('owner') == playerId;
}





alt.on('playerEnteringVehicle', (player, vehicle, seat) => {
    if (vehicle.lock)
        return;

    if (isOwner(player, vehicle)) {
        const findVehicleLock = vehicleLocks
        vehicleLocks = vehicleLocks.filter(lock => {
            if (lock.vehicleId == vehicle.id) {
                lock.label.destroy();
                return false; 
            }
            return true; 
        });
    }
});

alt.on('playerLeftVehicle', (player, vehicle, seat) => {
    if (isOwner(player, vehicle)) {
        createTextLabel(player, vehicle); 
    }
})

export interface VehicleLock {
    vehicleId : number,
    label  : any
}



export function createTextLabel(player, vehicle) {
    
    const label = Rebar.controllers.useD2DTextLabelLocal(player, {
        pos: vehicle.pos,
        text: 'press E to lock the vehicle',
    });

    const interaction = Rebar.controllers.useInteractionLocal(player, 'test', 'Cylinder', [
        vehicle.pos.x,
        vehicle.pos.y,
        vehicle.pos.z - 1,
        4,
        2,
    ]);

    interaction.on((player: alt.Player) => {
        label.update({text : "press E to unLock the vehicle"})
        const rVehicle = Rebar.vehicle.useVehicle(vehicle); 
        if (rVehicle.vehicle.lockState == 2) {
            label.update({text : "press E to unLock the vehicle"})

        } else {
            label.update({text : "press E to lock the vehicle"})
        }

        rVehicle.toggleLock();
    });

    let vehicleLock = {vehicleId: vehicle.id, label: label};
    vehicleLocks.push(vehicleLock);
}




