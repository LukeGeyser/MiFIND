import React, { useState, Component } from 'react';

import { GroupsAccordion } from '../dashboard/GroupsAccordion'

export class Sidebar extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            
        };
    }

    render() {

        return (
            <div id="SideBar">

                <div id="SideBarLogo"></div>

                <div id="Search_div" align="center">
                    <input placeholder="Search " id="SearchInput" align="center" />
                    <span align="center">
                        <i className="fas fa-search text-black-50 fa-lg" id="SearchIcon"></i>
                    </span>
                </div>

                {this.props.dataFromParent.groups.map((group) => {
                    console.log(group);
                    return <h1>{group.Name}</h1>
                })}
                
            </div>
        )
    }
}
