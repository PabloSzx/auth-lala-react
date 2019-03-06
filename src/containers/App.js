import { get } from "lodash";
import queryString from "query-string";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { fetchUser, logoutUser } from "../actions";
import { Auth, RecoverPassword, Admin } from "./";

class LogoutComponent extends Component {
  componentWillMount() {
    this.props.logoutUser();
    const callback = get(
      queryString.parse(this.props.location.search),
      "callback",
      false
    );

    if (callback) {
      window.location.replace(callback || "https://trac.uach.lalaproject.org/");
    }
  }

  render() {
    return <Redirect to="/auth" />;
  }
}

const Logout = connect(
  null,
  { logoutUser }
)(LogoutComponent);

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/logout" component={Logout} />
        <Route
          exact
          path="/unlock/:email/:unlockKey"
          component={RecoverPassword}
        />
        <Redirect from="/*" to="/auth" />
      </Switch>
    );
  }
}

const mapStateToProps = ({ auth, redirect }, ownProps) => {
  return { auth, redirect };
};

export default withRouter(
  connect(
    mapStateToProps,
    { fetchUser }
  )(App)
);
