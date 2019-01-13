import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { fetchUser, logoutUser } from "../actions";
import { Auth } from "./";

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
    if (prevProps.auth !== this.props.auth && this.props.auth) {
      window.location.replace(
        process.env.NODE_ENV === "development"
          ? `http://${window.location.hostname}:8080/home`
          : `http://${window.location.host}/home`
      );
    }
  };

  render() {
    const { auth } = this.props;
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/logout" component={Logout} />
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
