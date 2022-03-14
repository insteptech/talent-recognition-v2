import React, { Dispatch, useEffect } from "react";
import {Route } from 'react-router'
import "./App.css";
import "./styles/sb-admin-2.min.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/Account/Login";
import Admin from "./components/Admin/Admin";
import { PrivateRoute } from "./common/components/PrivateRoute";
import { AccountRoute } from "./common/components/AccountRoute";
import { appLoad } from "./store/actions/account.actions";
import { useDispatch } from "react-redux";

const App: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    dispatch(appLoad());
  });

  return (
    <div className="App" id="wrapper">
      <Router>
        <Switch>
          <PrivateRoute path="/">
            <Admin />
          </PrivateRoute>
          <AccountRoute path="/login">
            <Login />
          </AccountRoute>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
