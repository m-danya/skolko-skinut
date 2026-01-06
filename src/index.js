import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import {
  AfterPartyArticle,
  MainIntentArticle,
  SplitAmountArticle
} from './SeoArticles';

ReactDOM.render(

  <React.StrictMode>

    <Router>
      <Switch>
        <Route
          exact
          path="/kto-komu-skolko-dolzhen"
          component={MainIntentArticle}
        />
        <Route
          exact
          path="/razdelit-summu-na-chelovek"
          component={SplitAmountArticle}
        />
        <Route
          exact
          path="/posle-vecherinki-kto-skolko-skinulsya"
          component={AfterPartyArticle}
        />
        <Route
          path="/:id?"
          component={App} />
      </Switch>
    </Router>
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
