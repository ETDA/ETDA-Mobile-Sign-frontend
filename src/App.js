import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Navbar from "./layout/Navbar";
import Demo from "./page/demo/index";

function App() {
  return (
    <BrowserRouter basename="/tedasign">
      <Navbar />
      <div className="container">
        <Switch>
          <Route path="/" component={Demo} exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
