import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SignIn from './components/SignIn';
import UserCardbase from './components/UserCardbase';
import SignOut from './components/SignOut';
import SignUp from './components/SignUp';
import RequireAuth from './components/HOC/RequireAuth';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
      <Router>
        <div>
          <Route path="/" component={App} />
          <Route path="/signin" component={SignIn} />
          <Route path="/usercardbase" component={RequireAuth(UserCardbase)} />
          <Route path="/signout" component={SignOut} />
          <Route path="/signup" component={SignUp} />
        </div>
      </Router>
    </Provider>,
    document.getElementById('root')
  );
