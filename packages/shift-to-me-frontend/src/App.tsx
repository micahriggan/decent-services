import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import './App.css';
import { MainContainer } from './containers/Main/Main';
import { ViewContainer } from './containers/View/View';
import { InvoiceContainer } from './containers/Invoice/Invoice';

// tslint: disable-next-line
const customHistory = createBrowserHistory();

class App extends React.Component {
  public render() {
    return (
      <Router history={customHistory}>
        <Switch>
          <Route exact={true} path="/" component={MainContainer} />
          <Route
            exact={true}
            path="/view/:address"
            component={ViewContainer}
          />
          <Route
            exact={true}
            path="/pay/:amount/:address"
            component={InvoiceContainer}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
