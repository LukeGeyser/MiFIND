import React, { Component } from 'react';
import { Button, Table, ButtonToolbar } from 'react-bootstrap';

import { AddDepartmentModal } from './AddDepartmentModal';

export class Department extends Component {

    constructor(props){
        super(props);
        this.state = {
            deps: [],
            addModalShow: false,
            updated: false
        };
    }

    refreshList(){
        this.setState({
            deps: [
                { "DepartmentID": 1, "DepartmentName": "IT"},
                { "DepartmentID": 2, "DepartmentName": "Admin"},
            ]
        })
    }

    updateList(){
        this.setState({
            deps: [
                { "DepartmentID": 1, "DepartmentName": "IT"},
                { "DepartmentID": 2, "DepartmentName": "Admin"},
                { "DepartmentID": 3, "DepartmentName": "Operations"},
                { "DepartmentID": 4, "DepartmentName": "Development"},
            ]
        })
    }

    componentDidMount(){
        this.refreshList();
    }

    componentDidUpdate(){
        let updated = this.state.updated;

        if (updated){
            this.updateList();
            this.setState({
                updated: false
            })
        }
    }

    render(){
        const { deps } = this.state;

        let addModalClose = () => {
            this.setState({
                addModalShow: false,
                updated: true
            })
        }

        return (
            
            <div>
                <Table className="mt-4" striped bordered hover size="sm">

                <thead>
                    <tr>
                        <th>Department ID</th>
                        <th>Department Name</th>
                    </tr>
                </thead>

                <tbody>
                    {deps.map(dep =>
                        <tr key = {dep.DepartmentID}> 
                            <td>{dep.DepartmentID}</td>
                            <td>{dep.DepartmentName}</td>
                        </tr>
                    )}
                </tbody>


                </Table>

                <ButtonToolbar>
                <Button variant="primary" onClick={() => this.setState({ addModalShow: true })}>
                    Add New
                </Button>

                <AddDepartmentModal 
                    show={ this.state.addModalShow } 
                    onHide={ addModalClose }/>

                </ButtonToolbar>
            </div>
            
        )
    }
}