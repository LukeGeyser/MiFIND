import React, { Component } from 'react'

export class GroupsAccordion extends Component {

    constructor(props){
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                <button className='accordion' style={{fontSize: '12px'}}>{this.props.groupName}</button>
            </div>
        )
    }
}
