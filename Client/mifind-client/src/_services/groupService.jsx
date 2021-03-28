
//#region LOCAL IMPORTS

import { authService } from './authService'

//#endregion
let token = null;

authService.userTokenDetails.subscribe(x => token = x);

async function GetGroups(){

    const requestOptions = {
        method: 'GET',
        headers: { 
            'Authorization': 'Bearer ' + token
        },
    };

    let groups = await new Promise(function (resolve, reject) {
        setTimeout(function () {
            fetch(`http://localhost:443/api/v1/groups`, requestOptions)
                .then((data) => {
                    let jsonData = data.json();
                    resolve(jsonData);
                }).catch((error) => {
                    reject(error);
                });
        }, 0);
    });
    return groups;

}

export const groupService = {
    GetGroups,
}