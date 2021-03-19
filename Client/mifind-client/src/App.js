// eslint-disable-next-line
import logo from './logo.svg';
import './App.css';

//#region PACKAGE IMPORTS

// eslint-disable-next-line
import { BrowserRouter, Route, Router, Switch, Link } from 'react-router-dom';
import { Component } from 'react';
import { history } from './_helpers/historyHelper';

//#endregion

//#region LOCAL IMPORTS

import { Login } from './login/index';
import { Dashboard } from './dashboard/index';
import { authService } from './_services/authService';
import { NotFound } from './errors/404';

//#endregion

export class App extends Component{

  constructor(props){
    super(props);

    this.state = {
      token: null
    }
  }

  componentDidMount() {
    authService.userTokenDetails.subscribe(x => this.setState({ token: x }));
  }

  logout(){
    authService.Logout();
    history.push('/login');
  }

  render(){
    const { token } = this.state;
    return (
      <Router history={ history.HistoryCollection }>
        <div>
            {token &&
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <div className="navbar-nav">
                        <Link to="/dashboard" className="nav-item nav-link">Home</Link>
                        <Link to="/login" onClick={this.logout} className="nav-item nav-link">Logout</Link>
                    </div>
                </nav>
            }
            <div className="jumbotron">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <Route exact path="/dashboard" component={ Dashboard } />
                            <Route path="/login" component={ Login } />
                            <Route path="/" component={ Login } exact />
                            <Route component={ NotFound } />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <Switch>
        <Route path='/' component={ Login } exact />
        <Route path='/login' component={ Login } exact />
        <Route path='/dashboard' component={ Dashboard } exact />
        </Switch> */}
      </Router>
    )
  }

}

// export default App;
