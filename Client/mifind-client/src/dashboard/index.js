import React, { Component } from 'react';
import { authService } from '../_services/authService';
import { history } from '../_helpers/historyHelper';

export class Dashboard extends Component {

    constructor(props){
        super(props);

        this.state = {

        };
    }

    componentDidUpdate(){
        let canAccess = authService.canAccess();
        if (!canAccess)
            history.goBack();
    }

    render(){

        return(
            <div className="container">
                <h3>
                    Dashboard Page
                </h3>
            </div>
        )
    }

}