import React from "react";
import { Route, Switch } from "react-router-dom";
import NoMatch from "./containers/NoMatch";
import DNAParserContainer from "./containers/DNAParserContainer";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={DNAParserContainer} />
    <Route component={NoMatch} />
  </Switch>
);

export default Routes;
