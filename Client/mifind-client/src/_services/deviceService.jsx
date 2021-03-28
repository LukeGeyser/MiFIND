
//#region LOCAL IMPORTS

import { authService } from '../_services/authService'

//#endregion
let token = null;

authService.userTokenDetails.subscribe(x => token = x);

async function GetAllDevicesByGroup(groupID){

    const requestOptions = {
        method: 'GET',
        headers: { 
            'Authorization': 'Bearer ' + token
        },
    };

    let devices = await new Promise(function (resolve, reject) {
        setTimeout(function () {
            fetch(`http://localhost:443/api/v1/device/groups/${groupID}`, requestOptions)
                .then((data) => {
                    let jsonData = data.json();
                    resolve(jsonData);
                }).catch((error) => {
                    reject(error);
                });
        }, 0);
    });
    return devices;
}

export const deviceService = {
    GetAllDevicesByGroup,
};