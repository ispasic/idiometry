import React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./home/HomePage";
import AboutPage from "./about/AboutPage";
import PageNotFound from "./PageNotFound";
import ResultsPage from "./download-results/ResultsPage";
import RouteLayout from "../layout/RouteLayout";

function App() {
  return (
    <div>
      <Switch>
        <RouteLayout exact path="/" component={HomePage} />
        <RouteLayout path="/about" component={AboutPage} />
        <Route path="/results.txt/:query" component={ResultsPage} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}

export default App;
