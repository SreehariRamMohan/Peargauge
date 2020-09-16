import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// screens
import Home from "./Home/Home"
import SamplePage from "./SamplePage/SamplePage"
import StartLecture from "./StartLecture/StartLecture"
import CreateLectureDeck from "./CreateLectureDeck/CreateLectureDeck"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/home" exact component={Home} />
        <Route path={"/sample/"} exact component={SamplePage} />
        <Route path={"/create/"} exact component={CreateLectureDeck} />
        <Route path={"/sample/:id"} exact component={SamplePage} />
        <Route path={"/start"} exact component={StartLecture} />
      </Switch>
    </Router>
  );
}

export default App;
