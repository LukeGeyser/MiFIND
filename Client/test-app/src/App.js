import logo from './logo.svg';
import './App.css';
import { Home } from './components/Home';
import { Department } from './components/Department';
import { Employee } from './components/Employee';
import { NavigationBar } from './components/NavigationBar';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="container">

        <h3 className="m-3 d-flex justify-content-center">
          React JS DEMO
        </h3>

        <h5 className="m-3 d-flex justify-content-center">
          Employee Management Portal
        </h5>

        <NavigationBar />
        
        <Switch>
          <Route path='/' component={ Home } exact />
          <Route path='/department' component={ Department } />
          <Route path='/employee' component={ Employee } />
        </Switch>

      </div>
    </BrowserRouter>
  );
}

export default App;


{/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}