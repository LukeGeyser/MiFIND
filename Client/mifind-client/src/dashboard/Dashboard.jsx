import React, { Component } from 'react';
import { authService } from '../_services/authService';
import { history } from '../_helpers/historyHelper';

//#region LOCAL IMPORTS

import {Sidebar} from '../components/dashboard/Sidebar'
import { SimpleMap } from '../components/maps/Map'
import { deviceService } from '../_services/deviceService'
import { groupService } from '../_services/groupService'

//#endregion

export class Dashboard extends Component {

    constructor(props){
        super(props);

        this.state = {
            devicesGroupCollection: {
                groups: []
            },
        };
    }

    async componentDidMount(){
        let groups = await groupService.GetGroups();

        groups.map(async (item) => {
            let hasError = true;
            let devices = await deviceService.GetAllDevicesByGroup(item.Id);

            if (devices.length > 0)
                hasError = false;

            if (hasError && devices.error.Code)
                devices = null;

            this.state.devicesGroupCollection.groups.push({
                Id: item.Id,
                Name: item.Name,
                Devices: devices
            })
            return item;
        })
    }

    componentDidUpdate(){
        let canAccess = authService.canAccess();
        if (!canAccess)
            history.goBack();
    }

    render(){

        const { devicesGroupCollection } = this.state;

        return(
            (this.state.deviceCollection === null ?
                <div>Loading ...</div>
                :
                <div>
                    <SimpleMap />
                    <Sidebar dataFromParent={ devicesGroupCollection } />
                </div>    
            )
            
            
        )
    }

}