import { isEmpty, isString, get } from "lodash";
import queryString from "query-string";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { fetchUser, logoutUser } from "../actions";
import { Auth, RecoverPassword, Admin } from "./";

class LogoutComponent extends Component {
  componentWillMount() {
    this.props.logoutUser();
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
  componentDidMount() {
    this.props.fetchUser();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.auth !== this.props.auth &&
      !isString(this.props.auth) &&
      !isEmpty(this.props.auth) &&
      !get(this.props.auth, "admin", false)
    ) {
      const callback = get(
        queryString.parse(this.props.location.search),
        "callback",
        false
      );
      const fallback =
        process.env.NODE_ENV === "development"
          ? `http://${window.location.hostname}:8080/dashboard`
          : `http://${window.location.host}/dashboard`;

      window.location.replace(callback || fallback);
    }
  };

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

const mapStateToProps = ({ auth }, ownProps) => {
  return { auth };
};

export default withRouter(
  connect(
    mapStateToProps,
    { fetchUser }
  )(App)
);
