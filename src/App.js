import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// screens
import Home from "./Home/Home"
import SamplePage from "./SamplePage/SamplePage"
import StartLecture from "./StartLecture/StartLecture"
import CreateLectureDeck from "./CreateLectureDeck/CreateLectureDeck"
import Log from "./Log/Log"
import CreateEdit from "./CreateEdit/CreateEdit"
import AuthComponent from "./AuthComponent/AuthComponent"
import Settings from "./Settings/Settings"

import Log_redesign from "./Log_redesign/Log"


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AuthComponent(Home)} />
        <Route path="/home" exact component={AuthComponent(Home)} />
        <Route path="/logout" exact component={Log_redesign} />
        <Route path={"/sample/"} exact component={SamplePage} />
        <Route path={"/create/"} exact component={AuthComponent(CreateEdit)} />
        <Route path={"/sample/:id"} exact component={SamplePage} />
        <Route path={"/start"} exact component={AuthComponent(StartLecture)} />
        <Route path={"/settings"} exact component={AuthComponent(Settings)} />

      </Switch>
    </Router>
  );
}

export default App;
