import { isEmpty, isString } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
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
      false &&
      prevProps.auth !== this.props.auth &&
      !isString(this.props.auth) &&
      !isEmpty(this.props.auth)
    ) {
      window.location.replace(
        process.env.NODE_ENV === "development"
          ? `http://${window.location.hostname}:8080/home`
          : `http://${window.location.host}/home`
      );
    }
  };

  render() {
    return (
      <BrowserRouter>
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
      </BrowserRouter>
    );
  }
}

const mapStateToProps = ({ auth }, ownProps) => {
  return { auth };
};

export default connect(
  mapStateToProps,
  { fetchUser }
)(App);
