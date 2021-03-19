import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

import SnackBar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

export class AddDepartmentModal extends Component {

    // eslint-disable-next-line no-useless-constructor
    constructor(props){
        super(props);

        this.state = {
            snackBarOpen: false,
            snackBarMessage: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    snackBarClose = (event) => {
        this.setState({
            snackBarOpen: false
        })
    };

    handleSubmit(event){
        event.preventDefault();

        // alert(event.target.DepartmentName.value);
        this.setState({
            snackBarMessage: "Successful",
            snackBarOpen: true
        })
    }

    render(){
        return(
            <div className="container">

                <SnackBar 
                    anchorOrigin = { { vertical: 'bottom', horizontal: 'center' } } 
                    open = { this.state.snackBarOpen } 
                    autoHideDuration = { 3000 } 
                    onClose = { this.snackBarClose } 
                    message = {
                        <span id = "message-id">
                            { this.state.snackBarMessage }
                        </span>} 
                    action = { [
                        <IconButton 
                            key = "close"
                            aria-label = "Close" 
                            color = 'inherit'
                            onClick = { this.snackBarClose }>
                                X
                        </IconButton>
                    ] } />

                <Modal 
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>

                    <Modal.Header closeButton>
                        <Modal.Title id ="contained-modal-title-vcenter">
                            Add Department
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Row>
                            <Col sm={6}>
                            
                                <Form onSubmit={this.handleSubmit}>

                                    <Form.Group controlId="DepartmentName">
                                        <Form.Label>Department Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="DepartmentName"
                                            required
                                            placeholder="Department Name" />
                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="primary" type="submit">
                                            Add Department
                                        </Button>
                                    </Form.Group>

                                </Form>
                            
                            </Col>
                        </Row>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>

                </Modal>

            </div>
        )
    }

}