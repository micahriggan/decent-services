import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { BuyContainer } from './containers/buy/BuyContainer';
import { ListContainer } from './containers/list/ListContainer';
import { RegisterContainer } from './containers/register/RegisterContainer';
const customHistory = createBrowserHistory();

class App extends React.Component {
  public render() {
    return (
      <Router history={customHistory}>
        <Switch>
          <Route exact={true} path="/" component={ListContainer} />
          <Route exact={true} path="/buy/:app" component={BuyContainer} />
          <Route exact={true} path="/register" component={RegisterContainer} />
        </Switch>
      </Router>
    );
  }
}

export default App;
