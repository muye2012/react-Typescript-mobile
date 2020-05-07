import React, { Component } from 'react';
import { Switch,Route,Redirect } from 'react-router-dom';
import Counter from '../pages/counter';
import Home from '../pages/home/home';
import BuildRobot from "../pages/build/BuildRobot";
import SetTypePop from "../pages/build/SetTypePop";
import EditType from "../pages/home/EditType";
import EntrustDetail from "../pages/home/EntrustDetail";
interface IState {
  message: string
}

class App extends Component<{}, IState>{
  public render() {
    return (
      <div id="app">
        <Switch>
          <Route path="/counter" component={Counter}/>
          <Route path="/home" component={Home}/>
          <Route path="/build_robot/:addBreed" component={BuildRobot}/>
          <Route path="/build_robot" component={BuildRobot}/>
          <Route path="/set_type/:index/:grade" component={SetTypePop}/>
          <Route path="/edit_type/:item" component={EditType}/>
          <Route path="/entrust_detail/:id/:code" component={EntrustDetail}/>
          <Redirect to="/home"/>
        </Switch>
      </div>
    );
  }
}

export default App;
