import React, { Component } from 'react';

import { authService } from '../_services/authService'
import { history } from '../_helpers/historyHelper';

import { Button, Form } from 'react-bootstrap';

export class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: ''
        };

        this.login = this.login.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
    }

    usernameChange(event){
        this.setState({ username: event.target.value });
    }

    passwordChange(event){
        this.setState({ password: event.target.value });
    }

    async login(event){
        event.preventDefault();

        let token = await authService.Login(this.state.username, this.state.password);

        console.log(token.access_token);
        history.push('/dashboard');
    }

    render(){

        return(
            <div className="container">
                <Form onSubmit={ this.login }>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter Username" value={ this.state.username } onChange={ this.usernameChange } />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={ this.state.password } onChange={ this.passwordChange } />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }

}